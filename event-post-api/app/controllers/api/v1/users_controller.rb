module Api
  module V1
    class UsersController < ApplicationController
      skip_before_action :authenticate_user, only: %i[create index show]

      # 現在のユーザー情報を返す
      def current_user
        render json: @current_user || { error: 'Not authenticated' }, status: :ok
      end

      # ユーザーの一覧を取得
      def index
        render json: User.all
      end

      # 特定のユーザー情報を取得
      def show
        user = User.find(params[:id])
        render json: user
      end

      # ユーザーを作成
      def create
        user = User.new(user_params)
        if user.save
          render json: { message: 'User created successfully', user: user.slice(:id, :name, :email, :thumbnail, :description) }, status: :created
        else
          render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # ユーザー情報の更新
      def update
        if current_user&.id == params[:id].to_i
          if current_user.update(user_params)
            render json: { message: 'User updated successfully', user: current_user }
          else
            render json: { errors: current_user.errors.full_messages }, status: :unprocessable_entity
          end
        else
          render json: { error: 'Unauthorized action' }, status: :unauthorized
        end
      end

      # ユーザー削除
      def destroy
        if current_user&.id == params[:id].to_i
          current_user.destroy
          render json: { message: 'User deleted successfully' }
        else
          render json: { error: 'Unauthorized action' }, status: :unauthorized
        end
      end

      private

      def user_params
        params.require(:user).permit(:name, :email, :password, :password_confirmation, :thumbnail, :description)
      end
    end
  end
end
