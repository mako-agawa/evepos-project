module Api
  module V1
    class UsersController < ApplicationController
      skip_before_action :authenticate_user, only: %i[create index show]
      include Rails.application.routes.url_helpers

      # 現在のユーザー情報を返す
      def current_user
        if @current_user
          render json: user_info_with_thumbnail(@current_user), status: :ok
        else
          render json: { error: 'Not authenticated' }, status: :unauthorized
        end
      end

      # ユーザーの一覧を取得
      def index
        users = User.all.map { |user| user_info_with_thumbnail(user) }
        render json: users
      end

      # 特定のユーザー情報を取得
      def show
        user = User.find(params[:id])
        render json: user_info_with_thumbnail(user)
      end

      # ユーザーを作成
      def create
        user = User.new(user_params)
        if user.save
          token = encode_token({ user_id: user.id }) # トークンを生成
          render json: {
            message: 'User created successfully',
            user: user_info_with_thumbnail(user),
            token: token
          }, status: :created
        else
          render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # ユーザー情報の更新
      def update
        @user = User.find_by(id: params[:id]) # ✅ ここで @user を定義
        if @user.update(user_params)
          render json: { message: 'User updated successfully', user: user_info_with_thumbnail(@user) }, status: :ok
        else
          render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
        end
      end


      # ユーザー削除
      def destroy
        if current_user&.id == params[:id].to_i
          if current_user.destroy
            render json: { message: 'User deleted successfully' }, status: :ok
          else
            render json: { error: 'Failed to delete user', details: current_user.errors.full_messages },
                   status: :unprocessable_entity
          end
        else
          render json: { error: 'Unauthorized action' }, status: :unauthorized
        end
      end

      private

      def user_info_with_thumbnail(user)
        {
          id: user.id,
          name: user.name,
          email: user.email,
          description: user.description,
          thumbnail_url: user.thumbnail.attached? ? url_for(user.thumbnail) : nil
        }
      end

      def user_params
        params.require(:user).permit(:name, :email, :password, :password_confirmation, :description, :thumbnail)
      end
    end
  end
end
