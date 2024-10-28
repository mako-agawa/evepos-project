class User < ApplicationRecord
  has_secure_password  # bcryptを使用してパスワードのハッシュ化を行う
  validates :name, presence: true
  validates :email, presence: true, uniqueness: true
  validates :password, presence: true, length: { minimum: 6 }, on: :create
end
