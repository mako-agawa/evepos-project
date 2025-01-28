# frozen_string_literal: true

module Api
  module V1
    class CommentsController < ApplicationController
      before_action :authenticate_user, only: %i[create destroy]
      before_action :set_event, only: %i[index create destroy]
      before_action :set_comment, only: :destroy

      # イベントに紐づくコメント一覧を取得
      def index
        comments = @event.comments.includes(:user) # ユーザーを事前ロード
        render json: comments.map { |comment| format_comment(comment) }, status: :ok
      end

      # コメントを作成
      def create
        comment = @event.comments.build(comment_params.merge(user: current_user))
        if comment.save
          render json: { message: 'Comment created successfully', comment: format_comment(comment) }, status: :created
        else
          render json: { errors: comment.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # コメントを削除
      def destroy
        if @comment.user == current_user
          @comment.destroy
          render json: { message: 'Comment deleted successfully' }, status: :ok
        else
          render json: { error: 'Unauthorized' }, status: :forbidden
        end
      end

      private

      # イベントをセット
      def set_event
        @event = Event.find_by(id: params[:event_id])
        render json: { error: 'Event not found' }, status: :not_found unless @event
      end

      # コメントをセット
      def set_comment
        @comment = @event.comments.find_by(id: params[:id])
        render json: { error: 'Comment not found' }, status: :not_found unless @comment
      end

      # コメントのパラメータを許可
      def comment_params
        params.require(:comment).permit(:content)
      end

      # コメントデータを整形
      def format_comment(comment)
        {
          id: comment.id,
          content: comment.content,
          user: {
            id: comment.user.id,
            name: comment.user.name,
            thumbnail: comment.user.thumbnail.attached? ? Rails.application.routes.url_helpers.url_for(comment.user.thumbnail) : nil
          }
        }
      end
    end
  end
end
