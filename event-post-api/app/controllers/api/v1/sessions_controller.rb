module Api
  module V1
    class SessionsController < ApplicationController
      before_action :authenticate_user, except: [:create]
      # skip_before_action :authenticate_user, only: [:create] # 認証なしでcreateを許可

      def create
        user = User.find_by(email: params[:email])
        if user&.authenticate(params[:password])
          token = encode_token({ user_id: user.id }) # トークンを生成

          data = {
            id: user.id,
            name: user.name,
            email: user.email,
            thumbnail: nil, # 修正: null → nil
            description: user.description
          }
          render json: { token: token, message: 'Logged in successfully!', user: data }, status: :ok
        else
          render json: { error: 'Invalid email or password' }, status: :unauthorized
        end
      end

    end
  end
end
