class ApplicationController < ActionController::API
  before_action :authenticate_user

  private

  def authenticate_user
    decoded_token = decode_token
    if decoded_token
      user_id = decoded_token[0]['user_id']
      @current_user = User.find_by(id: user_id)
    else
      render json: { error: 'Unauthorized access' }, status: :unauthorized
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
