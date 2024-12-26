class User < ApplicationRecord
  has_secure_password

  validates :name, presence: true
  validates :email, presence: true, uniqueness: true
  validates :password, presence: true, length: { minimum: 6 }

  before_create :generate_authentication_token

  has_many :events, dependent: :destroy  # この行を追加
  has_many :comments, dependent: :destroy
  has_many :likes, dependent: :destroy
  has_many :liked_events, through: :likes, source: :event

  private

  def generate_authentication_token
    payload = { user_id: self.id, exp: 1.year.from_now.to_i } # 有効期限を1年後に設定
    self.authentication_token = JWT.encode(payload, Rails.application.credentials.secret_key_base, 'HS256')
  end
end
