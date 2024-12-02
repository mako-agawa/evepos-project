class CreateLikes < ActiveRecord::Migration[7.2]
  def change
    create_table :likes do |t|
      t.integer :user_id
      t.integer :event_id

      t.timestamps
    end
     # ユニークインデックスで、同じユーザーが同じイベントに複数いいねするのを防ぐ
     add_index :likes, [:user_id, :event_id], unique: true

     # 外部キーを追加（必要に応じて）
     add_foreign_key :likes, :users
     add_foreign_key :likes, :events
  end
end
