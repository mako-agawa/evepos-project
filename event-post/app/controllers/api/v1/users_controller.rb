module Api
  module V1
    class UsersController < ApplicationController
      before_action :authenticate_user, only: [:current_user] # 認証が必要
      skip_before_action :authenticate_user, only: [:create, :index, :show] # 必要に応じてアクションをスキップ

      def current_user
        if @current_user
          render json: @current_user, status: :ok
        else
          render json: { error: 'Not authenticated' }, status: :unauthorized
        end
      end


      def index
        users = User.all
        render json: users, status: :ok
      end

      def show
        user = User.find(params[:id])
        render json: user, status: :ok
      end

      def create
        user = User.new(user_params)
        if user.save
          render json: { message: 'User created successfully', user: user }, status: :created
        else
          Rails.logger.error("User creation failed: #{user.errors.full_messages}")
          render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
        end
      rescue StandardError => e
        Rails.logger.error("Unexpected error during user creation: #{e.message}")
        render json: { error: 'Unexpected error occurred' }, status: :internal_server_error
      end

      def update
        if current_user&.id == params[:id].to_i
          if current_user.update(user_params)
            render json: { message: 'User updated successfully', user: current_user }, status: :ok
          else
            render json: { errors: current_user.errors.full_messages }, status: :unprocessable_entity
          end
        else
          render json: { error: 'Unauthorized action' }, status: :unauthorized
        end
      end

      def destroy
        if current_user&.id == params[:id].to_i
          current_user.destroy
          render json: { message: 'User deleted successfully' }, status: :ok
        else
          render json: { error: 'Unauthorized action' }, status: :unauthorized
        end
      end

      private

      def encode_token(payload)
        JWT.encode(payload, 'your_secret_key', 'HS256')
      end

      def user_params
        params.require(:user).permit(:name, :email, :password, :password_confirmation, :thumbnail, :description)
      end
    end
  end
end
