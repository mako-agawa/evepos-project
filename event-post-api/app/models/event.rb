class Event < ApplicationRecord
  has_many :comments, dependent: :destroy
  belongs_to :user
  # その他のコード…
end
