# frozen_string_literal: true

class Event < ApplicationRecord
  belongs_to :user  # この行を追加
  # その他のコード...
end
