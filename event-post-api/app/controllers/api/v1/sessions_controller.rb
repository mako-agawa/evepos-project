module Api
  module V1
    class SessionsController < ApplicationController
      before_action :authenticate_user
      skip_before_action :authenticate_user, only: [:create] # 認証なしでcreateを許可

      def create
        puts "====== sessions ======="
        user = User.find_by(email: params[:email])
        puts
        if user&.authenticate(params[:password])
          token = encode_token({ user_id: user.id }) # トークンを生成
          render json: { token: token, message: 'Logged in successfully!', user: user }, status: :ok
        else
          render json: { error: 'Invalid email or password' }, status: :unauthorized
        end
      end

      def destroy
        # APIの場合、サーバー側でセッションをクリアする処理はないため、
        # クライアント側でトークンを削除するだけでログアウトとする。
        render json: { message: 'Logged out!' }, status: :ok
      end

      private

      def encode_token(payload)
        JWT.encode(payload, 'your_secret_key', 'HS256') # トークン生成に秘密鍵を使用
      end
    end
  end
end
