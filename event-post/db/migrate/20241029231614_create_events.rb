# frozen_string_literal: true

class CreateEvents < ActiveRecord::Migration[7.2]
  def change
    create_table :events do |t|
      t.string :title
      t.datetime :date
      t.string :location
      t.text :description
      t.string :price
      t.integer :user_id

      t.timestamps
    end
  end
end
