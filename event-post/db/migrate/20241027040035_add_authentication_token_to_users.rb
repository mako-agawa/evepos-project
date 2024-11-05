# frozen_string_literal: true

class AddAuthenticationTokenToUsers < ActiveRecord::Migration[7.2]
  def change
    add_column :users, :authentication_token, :string
  end
end
