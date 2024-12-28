# frozen_string_literal: true

require 'active_support/core_ext/numeric/bytes'

Rails.application.configure do
  config.require_master_key = true
  config.eager_load = true

  # SSLの設定 (ALBでSSLを管理する場合はコメントアウトのまま)
  # config.force_ssl = true

  config.secret_key_base = ENV["SECRET_KEY_BASE"] || Rails.application.credentials.secret_key_base
  config.logger = ActiveSupport::Logger.new(Rails.root.join('log', 'production.log'), 1, 50.megabytes)
  config.log_tags = [:request_id]
  config.log_level = :debug

  config.hosts << '18.178.110.119'
  config.hosts << '127.0.0.1'
  config.hosts << '::1'
  config.hosts << 'api.evepos.net'
  config.hosts << "evepos-elb-1733878306.ap-northeast-1.elb.amazonaws.com"

  config.host_authorization = {
    exclude: ->(request) {
      request.path == '/up' ||
      ['127.0.0.1', '::1', '18.178.110.119'].include?(request.remote_ip) ||
      request.host == 'api.evepos.net'
    }
  }

  config.public_file_server.enabled = false
  config.action_mailer.perform_caching = false
  config.action_mailer.raise_delivery_errors = false

  # config.active_storage.service = :local

  config.active_record.verbose_query_logs = false
  config.active_record.dump_schema_after_migration = false
  config.active_record.logger = nil
  config.i18n.fallbacks = true
  config.active_support.report_deprecations = false
end
