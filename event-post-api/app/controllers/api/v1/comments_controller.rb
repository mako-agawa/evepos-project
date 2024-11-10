module Api
  module V1
    class CommentsController < ApplicationController
      before_action :authenticate_user, only: %i[create destroy]
      before_action :set_event, only: %i[create destroy]
      before_action :set_comment, only: :destroy

      def create
        comment = @event.comments.build(comment_params)
        comment.user = current_user
        if comment.save
          render json: { message: 'Comment created successfully', comment: comment }, status: :created
        else
          render json: { errors: comment.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        if @comment.user == current_user
          @comment.destroy
          head :no_content
        else
          render json: { error: 'Unauthorized' }, status: :forbidden
        end
      end

      private

      def set_event
        @event = Event.find(params[:event_id])
      end

      def set_comment
        @comment = @event.comments.find(params[:id])
      end

      def comment_params
        params.require(:comment).permit(:content)
      end
    end
  end
end
