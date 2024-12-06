# module Api
#   module V1
#     class LikesController < ApplicationController
#       before_action :authenticate_user!

#       def create
#         event = Event.find(params[:event_id])
#         like = event.likes.new(user: current_user)

#         if like.save
#           render json: { message: 'Liked successfully', likes_count: event.likes.count }, status: :ok
#         else
#           render json: { error: 'Failed to like', details: like.errors.full_messages }, status: :unprocessable_entity
#         end
#       end

#       def destroy
#         event = Event.find(params[:event_id])
#         like = event.likes.find_by(user: current_user)

#         if like&.destroy
#           render json: { message: 'Unliked successfully', likes_count: event.likes.count }, status: :ok
#         else
#           render json: { error: 'Failed to unlike' }, status: :unprocessable_entity
#         end
#       end
#     end
#   end
# end
#
