class User < ApplicationRecord
  has_secure_password

  before_create :generate_authentication_token

  private

  def generate_authentication_token
    self.authentication_token = SecureRandom.hex(10) # 20文字のランダムなトークンを生成
  end
end
