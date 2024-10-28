class Api::V1::SessionsController < ApplicationController
  before_action :authenticate_user, only: [:destroy]
  skip_before_action :verify_authenticity_token

  def create
    user = User.find_by(email: params[:email])

    if user && user.authenticate(params[:password])
      token = SecureRandom.hex(10)
      user.update(authentication_token: token)

      render json: { token: token, message:"Login successful" }, status: :ok
    else
      render json: { error: "Invalid email or password" }, status: :unauthorized
    end
  end

  def destroy
    user = User.find_by(authentication_token: request.headers['Authorization'])

    if user
      user.update(authentication_token: nil)
      render json: { message: "Logout successful" }, status: :ok
    else
      render json: { error: "Invalid token" }, status: :unauthorized
    end
  end
  private

  def authenticate_user
    token = request.headers['Authorization']
    @current_user = User.find_by(authentication_token: token)

    unless @current_user
      render json: { error: "Unauthorized" }, status: :unauthorized
    end
  end
end
