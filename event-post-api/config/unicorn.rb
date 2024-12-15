app_path = '/home/ec2-user/evepos-project/event-post-api'

worker_processes 2
working_directory app_path

# ログファイルの出力先
stderr_path File.join(app_path, 'log', 'unicorn.stderr.log')
stdout_path File.join(app_path, 'log', 'unicorn.stdout.log')

# ソケットファイルの指定
listen File.join(app_path, 'tmp', 'sockets', 'unicorn.sock'), backlog: 64

# PIDファイルの指定
pid File.join(app_path, 'tmp', 'pids', 'unicorn.pid')

# Unicornのタイムアウト設定
timeout 60

# Unicornのプリロードを有効化
preload_app true

# フォークの前に実行する処理
before_fork do |server, worker|
  defined?(ActiveRecord::Base) and ActiveRecord::Base.connection.disconnect!
end

# フォークの後に実行する処理
after_fork do |server, worker|
  defined?(ActiveRecord::Base) and ActiveRecord::Base.establish_connection
end
