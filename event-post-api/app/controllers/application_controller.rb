class ApplicationController < ActionController::API
  before_action :authenticate_user

  private

  def authenticate_user
    token = request.headers['Authorization']&.split(' ')&.last
    if token.present?
      payload = decode_token(token)
      if payload
        @current_user = User.find_by(id: payload['user_id'])
        render json: { error: 'User not found' }, status: :unauthorized unless @current_user
      else
        render json: { error: 'Invalid token' }, status: :unauthorized
      end
    else
      render json: { error: 'Missing token' }, status: :unauthorized
    end
  end

  attr_reader :current_user
  def encode_token(payload)
    expiration_time = 3.month.from_now.to_i # 有効期限は24時間
    payload[:exp] = expiration_time
    JWT.encode(payload, Rails.application.credentials.secret_key_base, 'HS256')
  end

  def decode_token(token)
    secret_key = Rails.application.credentials.secret_key_base
    JWT.decode(token, secret_key, true, algorithm: 'HS256')[0] # ペイロード部分を返す
  rescue JWT::ExpiredSignature
    nil # 期限切れトークンの場合
  rescue JWT::DecodeError
    nil # トークンの形式が正しくない場合
  end

end
