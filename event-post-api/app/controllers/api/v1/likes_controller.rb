# frozen_string_literal: true

module Api
  module V1
    class LikesController < ApplicationController
      before_action :authenticate_user # ユーザー認証
      before_action :set_event # 対象イベントの取得

      def index
        likes = @event.likes.includes(:user).map do |like|
          {
            id: like.id,
            user_id: like.user_id,
            event_id: like.event_id,
            created_at: like.created_at,
            user: {
              id: like.user.id,
              name: like.user.name,
              email: like.user.email
            }
          }
        end
        render json: likes
      end

      # POST /api/v1/events/:event_id/likes

      def create
        puts "=======LIKE======="
        puts params[:event_id]
        puts params[@event]
        puts "================="
        event = Event.find(params[:event_id])
        if current_user.liked_events.exists?(event.id)
          render json: { message: 'Already liked', likes_count: event.likes_count }, status: :ok
        else
          current_user.liked_events << event
          event.increment!(:likes_count)
          render json: { message: 'Liked successfully', likes_count: event.likes_count }, status: :ok
        end
      end

      # DELETE /api/v1/events/:id/likes
      def destroy
        puts "=====disLIKE====="
        puts params[:event_id]
        puts params[@event]

        puts "================="
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
