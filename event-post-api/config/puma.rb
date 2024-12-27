# TCPポートでのバインド
bind "tcp://0.0.0.0:3000"

# PIDファイル
pidfile "/home/ec2-user/evepos-project/event-post-api/tmp/pids/puma.pid"

# スレッドとワーカーの設定
threads 1, 5
workers 2

# ログファイル
stdout_redirect "/home/ec2-user/evepos-project/event-post-api/log/puma.stdout.log", "/home/ec2-user/evepos-project/event-post-api/log/puma.stderr.log", true

# preload_app を有効化
preload_app!

daemonize true

# worker 起動時の設定
on_worker_boot do
  require "active_record"
  ActiveRecord::Base.connection.disconnect! rescue ActiveRecord::ConnectionNotEstablished
  ActiveRecord::Base.establish_connection
end

# worker 停止時の設定
on_worker_shutdown do
  Rails.logger.info("Worker shutting down...")
end

# Puma クラスタ起動前の設定
before_fork do
  Rails.logger.info("Puma master process starting...")
end

# Puma クラスタ終了時の設定
after_worker_fork do
  Rails.logger.info("Puma worker process forked...")
end

# Puma サーバの状態を確認するためのコントロールアプリケーションの設定 (必要に応じて有効化)
activate_control_app "tcp://0.0.0.0:9293", { no_token: true }

# タイムアウト設定 (長時間リクエストでのタイムアウトを防ぐ)
worker_timeout 60

# プロセス名のタグ付け
tag "event-post-api"

# 必要に応じて再起動時の設定 (RubyのGCに関連するもの)
prune_bundler
