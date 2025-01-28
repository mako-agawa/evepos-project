class ChangeUserIdAndEventIdTypeInLikes < ActiveRecord::Migration[7.0]
  def change
    change_column :likes, :user_id, :bigint
    change_column :likes, :event_id, :bigint
  end
end
