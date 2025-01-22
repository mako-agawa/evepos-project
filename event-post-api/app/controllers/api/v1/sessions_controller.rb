module Api
  module V1
    class SessionsController < ApplicationController
      before_action :authenticate_user, except: [:create]
      # skip_before_action :authenticate_user, only: [:create] # 認証なしでcreateを許可

      def create
        puts '====== sessions ======='
        user = User.find_by(email: params[:email])
        puts "User found: #{user.present? ? user.email : 'Not found'}"
        if user&.authenticate(params[:password])
          puts '====== success ======='
          token = encode_token({ user_id: user.id }) # トークンを生成

          data = {
            id: user.id,
            name: user.name,
            email: user.email,
            thumbnail: nil, # 修正: null → nil
            description: user.description
          }
          # puts user.as_json(only: [:id, :name, :email, :description, :thumbnail])

          render json: { token: token, message: 'Logged in successfully!', user: data }, status: :ok
        else
          render json: { error: 'Invalid email or password' }, status: :unauthorized
        end
      end

      def destroy
        # APIの場合、サーバー側でセッションをクリアする処理はないため、
        # クライアント側でトークンを削除するだけでログアウトとする。
        render json: { message: 'Logged out!' }, status: :ok
      end
    end
  end
end
