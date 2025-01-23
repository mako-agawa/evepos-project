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
        # フロントエンドのドメインを指定（例: VercelのデプロイURLやカスタムドメイン）
        # origins '*'
        origins 'https://original-product-seven.vercel.app', 'https://www.evepos.net', 'http://localhost:3000'
        resource '*',
                 headers: :any,
                 methods: %i[get post put patch delete options head],
                 credentials: true
      end
    end
  end
end
