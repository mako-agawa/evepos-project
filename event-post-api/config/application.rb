# frozen_string_literal: true

require_relative 'boot'
require 'rails/all'

# dotenvを使って環境変数を読み込む
require 'dotenv/load'

Bundler.require(*Rails.groups)

module EventPost
  class Application < Rails::Application
    # APIモードを有効化（ビューやアセットは使わないが、必要なら手動で追加できる）
    config.api_only = true

    # Rails 7のデフォルト設定を適用
    config.load_defaults 7.2

    # CORSの設定
    config.middleware.insert_before 0, Rack::Cors do
      allow do
        origins '*'
        # origins 'https://www.evepos.net', 'http://localhost:3000'
        resource '*',
                 headers: :any,
                 methods: %i[get post put patch delete options head],
                 credentials: false
      end
    end
  end
end
