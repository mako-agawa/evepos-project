class AddAuthenticationTokensToExistingUsers < ActiveRecord::Migration[7.2]
  def up
    User.where(authentication_token: nil).find_each do |user|
      user.update(authentication_token: SecureRandom.hex(10))
    end
  end

  def down
    # トークンを削除したい場合の処理を記述
  end
end
