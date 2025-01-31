# frozen_string_literal: true

module Api
  module V1
    class CommentsController < ApplicationController
      before_action :authenticate_user, only: %i[create destroy]
      before_action :set_event, only: %i[index create destroy]
      before_action :set_comment, only: :destroy
      include Rails.application.routes.url_helpers

      # イベントに紐づくコメント一覧を取得
      def index
        comments = @event.comments.includes(:user).order(created_at: :desc) # ユーザーを事前ロード
        render json: comments.map { |comment| format_comment(comment) }, status: :ok
      end

      def create
        comment = current_user.comments.build(comment_params.merge(event_id: params[:event_id]))
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
        @event = Event.find(params[:event_id])
      end
      # コメントをセット
      def set_comment
        @comment = @event.comments.find(params[:id])
      end
      # コメントのパラメータを許可
      def comment_params
        params.require(:comment).permit(:content)
      end

      # コメントデータを整形
      # コメントデータを整形
      def format_comment(comment)
        {
          id: comment.id,
          content: comment.content,
          created_at: comment.created_at, # コメントの投稿時間を追加
          user: format_user(comment.user)  # ユーザー情報を共通メソッドで整形
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
    end
  end
end
