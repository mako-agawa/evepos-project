class ApplicationController < ActionController::API
  before_action :authenticate_user
  private

  def authenticate_user
    token = request.headers['Authorization']&.split(' ')&.last
    if token.present?
      begin
        secret_key = Rails.application.credentials.secret_key_base
        payload = JWT.decode(token, secret_key, true, algorithm: 'HS256')[0]
        @current_user = User.find_by(id: payload['user_id'])
      rescue JWT::ExpiredSignature
        render json: { error: 'Token has expired' }, status: :unauthorized
      rescue JWT::DecodeError
        render json: { error: 'Invalid token' }, status: :unauthorized
      end
    else
      render json: { error: 'Missing token' }, status: :unauthorized
    end
  end

  def current_user
    @current_user
  end

  def decode_token
    token = request.headers['Authorization']&.split(' ')&.last
    return nil unless token
    begin
      JWT.decode(token, 'your_secret_key', true, algorithm: 'HS256')
    rescue JWT::DecodeError
      nil
    end
  end
end
