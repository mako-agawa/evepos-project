# frozen_string_literal: true

require 'active_support/core_ext/numeric/bytes'

Rails.application.configure do
  # eager_loadをtrueにして、すべてのアプリケーションのコードが起動時にロードされるようにする
  config.eager_load = true

  config.secret_key_base = ENV["SECRET_KEY_BASE"] || Rails.application.credentials.secret_key_base

  # ログのフォーマット設定
  config.logger = ActiveSupport::Logger.new(Rails.root.join('log', 'production.log'), 1, 50.megabytes)
  config.log_tags = [:request_id]
  config.log_level = :info

  # ホストの許可
  config.hosts << '18.178.110.119'  # EC2のパブリックIPアドレス
  config.hosts << '127.0.0.1'       # ローカルホスト(IPv4)の許可
  config.hosts << '::1'             # ローカルホスト(IPv6)の許可
  config.hosts << 'api.evepos.net'  # APIのドメインを許可

  # ホストの認証をカスタマイズ
  config.host_authorization = {
    exclude: ->(request) {
      request.path == '/up' ||
      ['127.0.0.1', '::1', '18.178.110.119'].include?(request.remote_ip) ||
      request.host == 'api.evepos.net'  # ホスト名で許可
    }
  }

  # 静的ファイルの配信を無効化
  config.public_file_server.enabled = false

  # ActionMailerの設定
  config.action_mailer.perform_caching = false
  config.action_mailer.raise_delivery_errors = false

  # ActiveStorageの設定（必要に応じてアンコメント）
  # config.active_storage.service = :local

  # Railsの不要なログを削減する
  config.active_record.verbose_query_logs = false
  config.active_record.dump_schema_after_migration = false
  config.active_record.logger = nil

  # 本番環境のSSLリダイレクトを無効化（ロードバランサーがSSLを管理する場合）
  # config.force_ssl = false

  # I18nのフォールバックを有効化
  config.i18n.fallbacks = true

  # アクティブサポートのデプリケーションログを表示しない
  config.active_support.report_deprecations = false
end
