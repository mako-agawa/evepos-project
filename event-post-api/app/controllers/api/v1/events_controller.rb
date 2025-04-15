# frozen_string_literal: true

module Api
  module V1
    class EventsController < ApplicationController
      before_action :authenticate_user, only: %i[create update destroy like user_liked]
      before_action :set_event, only: %i[update destroy]
      before_action :authorize_user!, only: %i[update destroy]
      include Rails.application.routes.url_helpers # 画像URL生成用

      # GET /api/v1/events 新着順（作成日が新しい順）で全てのイベントを取得
      def index
        events = Event.includes(:user).order(created_at: :desc).map { |event| event_info_with_user(event) }
        render json: events
      end

      # GET /api/v1/events/schedule 直近の予定日順でイベントを取得

      def schedule
        events = Event.includes(:user).where('date >= ?', Date.today).order(date: :asc)
                      .map { |event| event_info_with_user(event) }
        render json: events
      end

      # GET /api/v1/events/archive 過去のイベントを取得
      def archive
        events = Event.includes(:user).where('date < ?', Date.today).order(date: :desc)
                      .map { |event| event_info_with_user(event) }
        render json: events
      end

      def search
        if params[:query].present?
          search_term = params[:query].downcase
          matched_events = Event.includes(:user).where(
            "LOWER(title) LIKE :q OR LOWER(description) LIKE :q OR LOWER(location) LIKE :q",
            q: "%#{search_term}%"
          )
          events = matched_events.map { |event| event_info_with_user(event) }
        else
          events = []
        end

        render json: events
      end

      def user_liked
        user = User.find_by(id: params[:user_id])
        return render json: { error: 'User not found' }, status: :not_found unless user

        liked_events = user.liked_events.includes(:user).order(created_at: :desc)
        render json: liked_events.map { |event| event_info_with_user(event) }
      end

      # GET /api/v1/events/:id
      def show
        set_event
        render json: event_info_with_user(@event)
      end

      # POST /api/v1/events
      def create
        event = current_user.events.build(event_params)
        if event.save
          render json: { message: 'Event created successfully', event: event_info_with_user(event) }, status: :created
        else
          render json: { errors: event.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # PATCH/PUT /api/v1/events/:id
      def update
        set_event
        if @event.update(event_params)
          render json: { message: 'Event updated successfully', event: event_info_with_user(@event) }, status: :ok
        else
          render json: { errors: @event.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/events/:id
      def destroy
        if @event.destroy
          render json: { message: 'Event successfully deleted' }, status: :ok
        else
          render json: { error: 'Failed to delete event', details: @event.errors.full_messages },
                 status: :unprocessable_entity
        end
      end

      # POST /api/v1/events/:id/like
      def like
        event = Event.find(params[:id])
        if current_user.liked_events.exists?(event.id)
          current_user.liked_events.destroy(event)
          event.decrement!(:likes_count)
          render json: { message: 'いいねを解除しました', likes_count: event.likes_count }, status: :ok
        else
          current_user.liked_events << event
          event.increment!(:likes_count)
          render json: { message: 'いいねしました', likes_count: event.likes_count }, status: :ok
        end
      end

      private

      def event_params
        params.permit(:title, :date, :location, :description, :price, :image)
      end

      def set_event
        @event = Event.find_by(id: params[:id])
        render json: { error: 'Event not found' }, status: :not_found unless @event
      end

      # イベント情報と画像URLを含むハッシュを生成
      def event_info_with_user(event)
        {
          id: event.id,
          title: event.title,
          date: event.date,
          location: event.location,
          description: event.description,
          price: event.price,
          likes_count: event.likes_count,
          user_id: event.user_id,
          liked: current_user ? current_user.liked_events.exists?(event.id) : false,  # いいね済みかどうか
          image_url: event.image.attached? ? url_for(event.image) : nil,
          user: format_user(event.user) # ユーザー情報を別メソッドで整形
        }
      end

      # ユーザー情報を整形するヘルパーメソッド
      def format_user(user)
        {
          id: user.id,
          name: user.name,
          thumbnail_url: user.thumbnail.attached? ? url_for(user.thumbnail) : nil
        }
      end
      # イベント作成者であるか確認する
      def authorize_user!
        render json: { error: 'Unauthorized' }, status: :forbidden unless @event.user_id == current_user.id
      end
    end
  end
end
