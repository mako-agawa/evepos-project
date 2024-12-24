working_directory "/home/ec2-user/evepos-project/event-post-api"

# PIDファイルのパス
pid "/home/ec2-user/evepos-project/event-post-api/tmp/pids/unicorn.pid"

# ログファイルのパス
stderr_path "/home/ec2-user/evepos-project/event-post-api/log/unicorn.stderr.log"
stdout_path "/home/ec2-user/evepos-project/event-post-api/log/unicorn.stdout.log"

# ソケットの設定
listen "/home/ec2-user/evepos-project/event-post-api/tmp/sockets/unicorn.sock"
worker_processes 2
timeout 30
preload_app true

# フォーク前の処理
before_fork do |server, worker|
  # ActiveRecord の接続を切断
  defined?(ActiveRecord::Base) and ActiveRecord::Base.connection.disconnect!

  # ソケットファイルの権限を修正
  File.chmod(0777, "/home/ec2-user/evepos-project/event-post-api/tmp/sockets/unicorn.sock")
end

# フォーク後の処理
after_fork do |server, worker|
  # ActiveRecord の接続を再接続
  defined?(ActiveRecord::Base) and ActiveRecord::Base.establish_connection
end
