# frozen_string_literal: true

module Api
  module V1
    class LikesController < ApplicationController
      before_action :authenticate_user # ユーザー認証
      before_action :set_event # 対象イベントの取得

      # POST /api/v1/events/:event_id/likes
      def create
        like = @event.likes.find_or_create_by(user: current_user)

        status = like.persisted? ? :ok : :created
        render json: { message: 'Like added successfully', likes_count: @event.likes.count }, status: status
      end

      # DELETE /api/v1/events/:event_id/likes
      def destroy
        like = @event.likes.find_by(user: current_user)

        if like&.destroy
          render json: { message: 'Like removed successfully', likes_count: @event.likes.count }, status: :ok
        else
          render json: { error: 'Failed to remove like' }, status: :unprocessable_entity
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
