# frozen_string_literal: true

module Api
  module V1
    class EventsController < ApplicationController
      before_action :authenticate_user, only: %i[create update destroy like]
      before_action :set_event, only: %i[show update destroy like]
      before_action :authorize_user!, only: %i[update destroy]
      include Rails.application.routes.url_helpers # 画像URL生成用

      # GET /api/v1/events
      def index
        events = Event.all.map do |event|
          event_info_with_image(event)
        end
        render json: events
      end

      # GET /api/v1/events/:id
      def show
        render json: event_info_with_image(@event)
      end

      # POST /api/v1/events
      def create
        event = current_user.events.build(event_params)
        if event.save
          render json: { message: 'Event created successfully', event: event_info_with_image(event) }, status: :created
        else
          render json: { errors: event.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # PATCH/PUT /api/v1/events/:id
      def update
        if @event.update(event_params)
          render json: { message: 'Event updated successfully', event: event_info_with_image(@event) }, status: :ok
        else
          render json: { errors: @event.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/events/:id
      def destroy
        @event.destroy
        head :no_content
      end

      # POST /api/v1/events/:id/like
      def like
        @event.increment!(:likes_count)
        render json: { message: 'Liked successfully', likes_count: @event.likes_count }, status: :ok
      end

      private

      # イベント情報と画像URLを含むハッシュを生成
      def event_info_with_image(event)
        {
          id: event.id,
          title: event.title,
          date: event.date,
          location: event.location,
          description: event.description,
          price: event.price,
          likes_count: event.likes_count,
          user_id: event.user_id,
          image_url: event.image.attached? ? url_for(event.image) : nil
        }
      end

      # コールバックで共通の処理をまとめる
      def set_event
        @event = Event.find(params[:id])
      end

      # イベント作成者であるか確認する
      def authorize_user!
        render json: { error: 'Unauthorized' }, status: :forbidden unless @event.user_id == current_user.id
      end

      # Strong Parameters
      def event_params
        params.require(:event).permit(:title, :date, :location, :description, :price, :image)
      end
    end
  end
end
