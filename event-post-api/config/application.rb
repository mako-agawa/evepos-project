# frozen_string_literal: true

require_relative 'boot'
require 'rails/all'
require 'dotenv/load' # 環境変数をロード

Bundler.require(*Rails.groups)

module EventPost
  class Application < Rails::Application
    config.api_only = true # API モードを有効化
    config.load_defaults 7.2

    # CORS 設定
    config.middleware.insert_before 0, Rack::Cors do
      allow do
        origins '*'
        resource '*',
                 headers: :any,
                 methods: %i[get post put patch delete options head],
                 credentials: false
      end
    end
  end
end
