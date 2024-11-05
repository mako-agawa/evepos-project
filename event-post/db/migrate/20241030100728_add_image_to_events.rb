# frozen_string_literal: true

class AddImageToEvents < ActiveRecord::Migration[7.2]
  def change
    add_column :events, :image, :string
  end
end
