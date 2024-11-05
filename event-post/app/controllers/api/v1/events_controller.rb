# frozen_string_literal: true

module Api
  module V1
    class EventsController < ApplicationController
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

      # POST /api/v1/events
      def create
        event = Event.new(event_params)
        if event.save # 修正箇所: user.save -> event.save
          render json: { message: 'Event created successfully' }, status: :created
        else
          render json: { errors: event.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # PATCH/PUT /api/v1/events/:id
      def update
        if @event.update(event_params)
          render json: @event
        else
          render json: @event.errors, status: :unprocessable_entity
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
        params.require(:event).permit(:title, :date, :location, :description, :price, :user_id, :image)
      end
    end
  end
end
