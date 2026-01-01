# frozen_string_literal: true

require_relative 'boot'
require 'rails/all'
require 'dotenv/load' # 環境変数をロード

Bundler.require(*Rails.groups)

module EventPost
  class Application < Rails::Application
    config.api_only = true # API モードを有効化
    config.load_defaults 7.2

    config.time_zone = 'Tokyo'
    config.active_record.default_timezone = :local

    # CORS設定は環境ごとに設定（config/environments/development.rb と production.rb を参照）
  end
end
