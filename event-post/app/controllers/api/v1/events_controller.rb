# frozen_string_literal: true

module Api
  module V1
    class EventsController < ApplicationController
      before_action :authenticate_user, only: %i[create update destroy like]
      before_action :set_event, only: %i[show update destroy like]
      before_action :authorize_user!, only: %i[update destroy]

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
        event = current_user.events.build(event_params) # current_userが作成
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
        @event.increment!(:likes_count)
        render json: { message: 'Liked successfully' }, status: :ok
      end

      private

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
        params.require(:event).permit(:title, :date, :location, :description, :price, :image, :likes_count)
      end
    end
  end
end
