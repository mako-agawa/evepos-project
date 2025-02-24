# frozen_string_literal: true

require 'active_support/core_ext/numeric/bytes'

Rails.application.configure do
  # マスターキーの使用を強制
  config.require_master_key = true

  # 起動時にすべてのアプリケーションコードをロード
  config.eager_load = true

  # ALBがSSLを管理する場合はコメントアウト
  # config.force_ssl = true

  # シークレットキーの設定
  config.secret_key_base = ENV['SECRET_KEY_BASE'] || Rails.application.credentials.secret_key_base

  # ログ設定
  config.logger = ActiveSupport::Logger.new(
    Rails.root.join('log/production.log'),
    1,
    50.megabytes
  )
  config.log_tags = [:request_id]
  config.log_level = :info

  # ホストの許可リスト
  config.hosts += [
    'api.evepos.net', # カスタムドメイン
    'evepos-elb-1733878306.ap-northeast-1.elb.amazonaws.com', # ALBのDNS
    '10.0.1.83',                                     # ALBまたはプロキシの内部IP
    '10.0.2.30',                                     # 他の内部IP (必要に応じて)
    '127.0.0.1',                                     # ローカルホスト (IPv4)
    '::1'                                            # ローカルホスト (IPv6)
  ]

  # ホスト認証の例外条件を追加
  config.host_authorization = {
    exclude: lambda { |request|
      # 特定のパスやIPを除外
      request.path == '/health_check' || # ヘルスチェック用
        %w[127.0.0.1 ::1 10.0.1.83 10.0.2.30].include?(request.remote_ip) || # 内部IP
        request.host == 'api.evepos.net' # 信頼するホスト
    }
  }
  # ログの詳細設定
  config.active_record.verbose_query_logs = false
  config.active_record.dump_schema_after_migration = false
  config.active_record.logger = nil

  # 国際化のフォールバック設定
  config.i18n.fallbacks = true

  # 非推奨メッセージを表示しない
  config.active_support.report_deprecations = false

  # デフォルトURLの設定
  Rails.application.routes.default_url_options = {
    host: 'api.evepos.net',
    protocol: 'https' # HTTPSでアクセスする場合
  }

  # ActiveStorageの設定 (ローカルストレージを利用)
  # 静的ファイルの配信を有効化 (ActiveStorageローカルモード用)
  config.public_file_server.enabled = true
  config.active_storage.service = :local
  config.active_storage.resolve_model_to_route = :rails_storage_redirect

end
