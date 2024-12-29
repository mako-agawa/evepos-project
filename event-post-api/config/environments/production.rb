# frozen_string_literal: true

require 'active_support/core_ext/numeric/bytes'

Rails.application.configure do
  # マスターキーの使用を強制
  config.require_master_key = true

  # 起動時にすべてのアプリケーションコードをロード
  config.eager_load = true

  # SSL の設定 (ALB で SSL を管理する場合はコメントアウト)
  # config.force_ssl = true

  # シークレットキーの設定
  config.secret_key_base = ENV['SECRET_KEY_BASE'] || Rails.application.credentials.secret_key_base

  # ログ設定
  config.logger = ActiveSupport::Logger.new(
    Rails.root.join('log', 'production.log'),
    1,
    50.megabytes
  )
  config.log_tags = [:request_id]
  config.log_level = :info

  # ホストの許可リスト
  config.hosts += [
    '18.178.110.119',                                # EC2のパブリックIP
    '127.0.0.1',                                     # ローカルホスト (IPv4)
    '::1',                                           # ローカルホスト (IPv6)
    'api.evepos.net',                                # カスタムドメイン
    'evepos-elb-1733878306.ap-northeast-1.elb.amazonaws.com' # ALBのDNS
  ]

  # ホスト認証の例外条件
  config.host_authorization = {
    exclude: ->(request) {
      request.path == '/up' ||                        # 特定のパスを除外
      %w[127.0.0.1 ::1 18.178.110.119].include?(request.remote_ip) || # 信頼するIP
      request.host == 'api.evepos.net'                # 信頼するホスト
    }
  }

  # 静的ファイルの配信を無効化 (Nginxなどが管理する場合)
  config.public_file_server.enabled = false

  # メーラー設定
  config.action_mailer.perform_caching = false
  config.action_mailer.raise_delivery_errors = false

  # アクティブストレージ (必要に応じて設定)
  # config.active_storage.service = :local

  # ログの詳細設定
  config.active_record.verbose_query_logs = false
  config.active_record.dump_schema_after_migration = false
  config.active_record.logger = nil

  # 国際化のフォールバック設定
  config.i18n.fallbacks = true

  # 非推奨メッセージを表示しない
  config.active_support.report_deprecations = false
end
