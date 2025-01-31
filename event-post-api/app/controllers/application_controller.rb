class ApplicationController < ActionController::API
  before_action :authenticate_user

  private

  def authenticate_user
    token = request.headers['Authorization']&.split(' ')&.last
    puts '=======authenticate_user========'
    puts "Raw Authorization Header: #{request.headers['Authorization']}" # 生のヘッダーをログに出す
    puts "Extracted Token: #{token}"

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
    puts '========encode======='
    puts "payload: #{payload}"
    expiration_time = 3.months.from_now.to_i # 有効期限は3か月
    payload[:exp] = expiration_time
    secret_key = 'my_fixed_secret_key_for_testing_purposes'
    JWT.encode(payload, secret_key, 'HS256')
  end

  def decode_token(token)
    puts '========decode======='
    puts "token: #{token}"
    secret_key = 'my_fixed_secret_key_for_testing_purposes'
    JWT.decode(token, secret_key, true, algorithm: 'HS256')[0]
  rescue JWT::ExpiredSignature
    puts 'トークン期限切れ'
    nil # 期限切れトークンの場合
  rescue JWT::DecodeError => e
    puts "トークンのデコードエラー: #{e.message}"
    nil # トークンの形式が正しくない場合
  end
end
