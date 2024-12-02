class Event < ApplicationRecord
  has_many :comments, dependent: :destroy
  belongs_to :user
  # その他のコード…
  has_many :likes, dependent: :destroy
  has_many :liked_users, through: :likes, source: :user
end
