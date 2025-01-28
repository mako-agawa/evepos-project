# frozen_string_literal: true

module Api
  module V1
    class LikesController < ApplicationController
      before_action :authenticate_user # ユーザー認証
      before_action :set_event # 対象イベントの取得

      # POST /api/v1/events/:event_id/likes
      def create
        like = @event.likes.build(user: current_user)

        if like.save
          render json: { message: 'Like added successfully', likes_count: @event.likes.count }, status: :created
        else
          render json: { error: 'Unable to like the event', details: like.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/events/:event_id/likes
      def destroy
        like = @event.likes.find_by(user: current_user)

        if like
          like.destroy
          render json: { message: 'Like removed successfully', likes_count: @event.likes.count }, status: :ok
        else
          render json: { error: 'Like not found' }, status: :not_found
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
