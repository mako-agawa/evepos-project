class ChangeUserIdTypeInEvents < ActiveRecord::Migration[7.0]
  def change
    change_column :events, :user_id, :bigint
  end
end
