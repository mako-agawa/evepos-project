# frozen_string_literal: true

module Api
  module V1
    class EventsController < ApplicationController
      before_action :authenticate_user, only: %i[create update destroy like]
      # before_action を使用して必要に応じて認証やフィルタリングを設定
      before_action :set_event, only: %i[show update destroy like]

      # GET /api/v1/events
      def index
        events = Event.all
        render json: events
      end

      # GET /api/v1/events/:id
      def show
        render json: @event
      end

      def create
        event = Event.new(event_params)
        if event.save
          render json: { message: 'Event created successfully', event: event }, status: :created
        else
          render json: { errors: event.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # PATCH/PUT /api/v1/events/:id
      def update
        if @event.update(event_params)
          render json: { message: 'Event updated successfully', event: @event }, status: :ok
        else
          render json: { errors: @event.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/events/:id
      def destroy
        @event.destroy
        head :no_content
      end

      def like
        # 例: likes_countをインクリメントする場合
        @event.increment!(:likes_count)
        render json: { message: 'Liked successfully' }, status: :ok
      end

      private

      # コールバックで共通の処理をまとめる
      def set_event
        @event = Event.find(params[:id])
      end

      # Strong Parameters
      def event_params
        params.require(:event).permit(:title, :date, :location, :description, :price, :user_id, :image, :likes_count)
      end

    end
  end
end
