# frozen_string_literal: true

module Api
  module V1
    class LikesController < ApplicationController
      before_action :authenticate_user, only: %i[create destroy] # ユーザー認証
      before_action :set_event # 対象イベントの取得
      include Rails.application.routes.url_helpers

      def index
        # 修正: ユーザー情報だけでなく、添付画像(thumbnail)の情報も一緒に取得する設定に変更
        likes = @event.likes.includes(user: { thumbnail_attachment: :blob }).map do |like|
          {
            id: like.id,
            user_id: like.user_id,
            event_id: like.event_id,
            created_at: like.created_at,
            user: {
              id: like.user.id,
              name: like.user.name,
              # 画像情報は既に取得済みなので、ここでSQLは発行されません
              thumbnail_url: like.user.thumbnail.attached? ? url_for(like.user.thumbnail) : nil
            }
          }
        end
        render json: likes
      end

      # POST /api/v1/events/:event_id/likes

      def create
        event = Event.find(params[:event_id])
        if current_user.liked_events.exists?(event.id)
          render json: { message: 'Already liked', likes_count: event.likes_count }, status: :ok
        else
          current_user.likes.create!(event: event)
          event.increment!(:likes_count)
          render json: {
            message: 'Liked successfully',
            likes_count: event.likes_count,
            user: {
              id: current_user.id,
              name: current_user.name,
              thumbnail_url: current_user.thumbnail.attached? ? url_for(current_user.thumbnail) : nil
            }
          }, status: :ok
        end
      end

      # DELETE /api/v1/events/:id/likes
      def destroy
        event = Event.find(params[:event_id])
        if current_user.liked_events.exists?(event.id)
          current_user.liked_events.destroy(event)
          event.decrement!(:likes_count)
          render json: { message: 'Unliked successfully', likes_count: event.likes_count }, status: :ok
        else
          render json: { message: 'Not liked yet', likes_count: event.likes_count }, status: :ok
        end
      end

      private

      def set_event
        @event = Event.find(params[:event_id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Event not found' }, status: :not_found
      end
    end
  end
end
