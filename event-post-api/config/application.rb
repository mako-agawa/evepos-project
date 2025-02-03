# frozen_string_literal: true

require_relative 'boot'
require 'rails/all'
require 'dotenv/load' # 環境変数をロード

Bundler.require(*Rails.groups)

module EventPost
  class Application < Rails::Application
    config.api_only = true # API モードを有効化
    config.load_defaults 7.2
    # リクエストの最大サイズを設定 (10MBに設定)
    # config.middleware.insert_before Rack::Runtime, Rack::TempfileReaper
    # config.middleware.insert_before ActionDispatch::Executor, Rack::ContentLength
    # config.middleware.insert_before ActionDispatch::Static, Rack::Deflater

    # config.middleware.use Rack::Parser, parsers: {
    #   'multipart/form-data' => lambda do |body|
    #     Rack::Multipart.parse_multipart(env)
    #   end
    # }, limit: 10 * 1024 * 1024 # 10MB

    # CORS 設定
    config.middleware.insert_before 0, Rack::Cors do
      allow do
        # フロントエンドのドメインを明示的に指定
        origins 'https://original-product-seven.vercel.app',
                'https://www.evepos.net',
                'http://localhost:3000' # ローカル環境用
        resource '*',
                 headers: :any,
                 methods: %i[get post put patch delete options head],
                 expose: ['Authorization'],
                 credentials: true # 認証情報を含むリクエストを許可
      end
    end
  end
end
