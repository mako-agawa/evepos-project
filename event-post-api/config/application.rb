require_relative 'boot'
require 'rails/all'
Bundler.require(*Rails.groups)

# ここにdotenvの読み込みを追加
require 'dotenv'
Dotenv.load('.env')

module EventPost
  class Application < Rails::Application
    config.load_defaults 7.2
    config.autoload_lib(ignore: %w[assets tasks])
    config.api_only = true

    # CORS設定
    config.middleware.insert_before 0, Rack::Cors do
      allow do
        origins 'http://localhost:3000', 'http://18.178.110.119'
        resource '*',
                 headers: :any,
                 methods: %i[get post put patch delete options head],
                 credentials: true
      end
    end
  end
end
