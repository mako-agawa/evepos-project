class CreateLikes < ActiveRecord::Migration[7.0]
  def change
    create_table :likes do |t|
      t.bigint :user_id, null: false
      t.bigint :event_id, null: false
      t.timestamps
    end

    add_index :likes, [:user_id, :event_id], unique: true
    add_foreign_key :likes, :users
    add_foreign_key :likes, :events
  end
end
