class Like < ApplicationRecord
  belongs_to :user
  belongs_to :event

  validates :user_id, uniqueness: { scope: :event_id } # 同じイベントに重複いいねを防ぐ
end
