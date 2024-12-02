class User < ApplicationRecord
  has_secure_password

  before_create :generate_authentication_token

  has_many :events, dependent: :destroy  # この行を追加
  has_many :comments, dependent: :destroy
  has_many :likes, dependent: :destroy
  has_many :liked_events, through: :likes, source: :event

  private

  def generate_authentication_token
    self.authentication_token = SecureRandom.hex(10) # 20文字のランダムなトークンを生成
  end
end
