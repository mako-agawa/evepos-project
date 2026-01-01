class ApplicationController < ActionController::API
  before_action :authenticate_user

  private

  def authenticate_user
    token = request.headers['Authorization']&.split(' ')&.last
    return render json: { error: 'Missing token' }, status: :unauthorized unless token.present?

    payload = decode_token(token)
    return render json: { error: 'Invalid token' }, status: :unauthorized unless payload

    @current_user = User.find_by(id: payload['user_id'])
    render json: { error: 'User not found' }, status: :unauthorized unless @current_user
  end

  attr_reader :current_user

  def encode_token(payload)
    expiration_time = 3.months.from_now.to_i # 有効期限は3か月
    payload[:exp] = expiration_time
    secret_key = jwt_secret_key
    JWT.encode(payload, secret_key, 'HS256')
  end

  def decode_token(token)
    secret_key = jwt_secret_key
    JWT.decode(token, secret_key, true, algorithm: 'HS256')[0]
  rescue JWT::ExpiredSignature
    Rails.logger.warn 'トークン期限切れ'
    nil # 期限切れトークンの場合
  rescue JWT::DecodeError => e
    Rails.logger.error "トークンのデコードエラー: #{e.message}"
    nil # トークンの形式が正しくない場合
  end

  def jwt_secret_key
    ENV['JWT_SECRET_KEY'] || Rails.application.credentials.jwt_secret_key || Rails.application.secret_key_base
  end
end
