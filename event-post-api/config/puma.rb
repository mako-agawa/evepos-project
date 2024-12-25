# ソケットの設定
# bind "unix:///home/ec2-user/evepos-project/event-post-api/tmp/sockets/puma.sock"
# TCPポートでのバインドに変更
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

# worker 起動時の設定
on_worker_boot do
  require "active_record"
  ActiveRecord::Base.connection.disconnect! rescue ActiveRecord::ConnectionNotEstablished
  ActiveRecord::Base.establish_connection
end
