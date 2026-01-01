class User < ApplicationRecord
  # ActiveStorageの設定 (画像の添付)
  before_create :generate_authentication_token
  has_secure_password
  has_one_attached :thumbnail, dependent: :destroy

  validates :name, presence: true
  validates :email, presence: true, uniqueness: true
  validates :password, length: { minimum: 6 }, allow_nil: true

  has_many :events, dependent: :destroy # ユーザーが削除された場合、イベントも削除
  has_many :comments, dependent: :destroy
  has_many :likes, dependent: :destroy
  has_many :liked_events, through: :likes, source: :event

  private

  def generate_authentication_token
    # ユーザーのIDが存在しない場合は仮のUUIDを使用してトークン生成
    user_id_for_token = id || SecureRandom.uuid
    payload = { user_id: user_id_for_token, exp: 1.year.from_now.to_i } # 有効期限を1年後に設定
    self.authentication_token = JWT.encode(payload, Rails.application.credentials.secret_key_base, 'HS256')
  end
end
