class Event < ApplicationRecord
  has_many :comments, dependent: :destroy
  belongs_to :user
  has_one_attached :image, dependent: :destroy # `dependent: :destroy` を追加
  # その他のコード…
  has_many :likes, dependent: :destroy
  has_many :liked_users, through: :likes, source: :user
  validates :title, :date, :location, :description, presence: true
end
