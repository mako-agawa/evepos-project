# frozen_string_literal: true

require 'active_support/core_ext/numeric/bytes'

Rails.application.configure do
 config.eager_load = true
  # ログのフォーマット設定
  config.logger = ActiveSupport::Logger.new(Rails.root.join('log', 'production.log'), 1, 50.megabytes)
  config.log_tags = [:request_id]
  config.log_level = :info

  # ホストの許可
  config.hosts << '18.178.110.119'
  config.host_authorization = { exclude: ->(request) { request.path == '/up' } }

  # ActionMailerの設定
  config.action_mailer.perform_caching = false
  config.action_mailer.raise_delivery_errors = false

  # Redisのキャッシュストアの設定
  # config.cache_store = :redis_cache_store, { url: ENV['REDIS_URL'] }

  # ActiveStorageの設定
  # config.active_storage.service = :local

  # Railsの不要なログを削減する
  config.active_record.verbose_query_logs = false
  config.active_record.dump_schema_after_migration = false
  config.active_record.logger = nil

  # 本番環境のSSLリダイレクトを有効化
  config.force_ssl = true

  # 静的ファイルのキャッシュを有効化
  config.public_file_server.enabled = true

  # DNSリバインディング攻撃を防ぐためのホスト許可
  config.hosts << '18.178.110.119'

  # すべてのI18nのフォールバックを有効化
  config.i18n.fallbacks = true

  # アクティブサポートのデプリケーションログを表示しない
  config.active_support.report_deprecations = false
end
