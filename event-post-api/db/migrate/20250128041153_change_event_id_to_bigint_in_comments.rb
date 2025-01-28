class ChangeEventIdToBigintInComments < ActiveRecord::Migration[7.0]
  def change
    change_column :comments, :event_id, :bigint
  end
end
