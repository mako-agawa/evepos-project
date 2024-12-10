# /home/ec2-user/evepos-project/event-post-api/config/unicorn.rb

# プロジェクトのアプリケーションのルートパスを指定
app_path = '/home/ec2-user/evepos-project/event-post-api'

worker_processes 2  # プロセス数。CPUコア数に応じて調整
working_directory app_path  # ここを修正！

# ログの出力先
stderr_path "#{app_path}/log/unicorn.stderr.log"
stdout_path "#{app_path}/log/unicorn.stdout.log"

# UNIXソケットの指定（Nginxと連携するためのソケット）
listen "#{app_path}/tmp/sockets/unicorn.sock"
pid "#{app_path}/tmp/pids/unicorn.pid"

# タイムアウト時間
timeout 60

preload_app true

before_fork do |server, worker|
  defined?(ActiveRecord::Base) and
    ActiveRecord::Base.connection.disconnect!
end

after_fork do |server, worker|
  defined?(ActiveRecord::Base) and
    ActiveRecord::Base.establish_connection
end
