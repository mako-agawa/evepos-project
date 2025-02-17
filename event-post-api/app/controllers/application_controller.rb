class ApplicationController < ActionController::API
  before_action :authenticate_user

  private

  def authenticate_user
    token = request.headers['Authorization']&.split(' ')&.last
    return render json: { error: 'Missing token' }, status: :unauthorized unless token.present?

    payload = decode_token(token)
    return render json: { error: 'Invalid token' }, status: :unauthorized unless payload

    @current_user = User.find_by(id: payload['user_id'])
    return render json: { error: 'User not found' }, status: :unauthorized unless @current_user
  end

  def current_user
    @current_user
  end

  def encode_token(payload)
    expiration_time = 3.months.from_now.to_i # 有効期限は3か月
    payload[:exp] = expiration_time
    secret_key = 'my_fixed_secret_key_for_testing_purposes'
    JWT.encode(payload, secret_key, 'HS256')
  end

  def decode_token(token)
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
