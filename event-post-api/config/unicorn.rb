# ソケットの設定
listen "/home/ec2-user/evepos-project/event-post-api/tmp/sockets/unicorn.sock"
worker_processes 2
timeout 30
preload_app true

# PIDファイル
pid "/home/ec2-user/evepos-project/event-post-api/tmp/pids/unicorn.pid"

# ログファイル
stderr_path "/home/ec2-user/evepos-project/event-post-api/log/unicorn.stderr.log"
stdout_path "/home/ec2-user/evepos-project/event-post-api/log/unicorn.stdout.log"

# フォーク前の処理
before_fork do |server, worker|
  # ActiveRecord の接続を切断
  defined?(ActiveRecord::Base) and ActiveRecord::Base.connection.disconnect!

  # 古いプロセスの終了
  old_pid = "#{server.config[:pid]}.oldbin"
  if File.exist?(old_pid) && server.pid != old_pid
    begin
      Process.kill("QUIT", File.read(old_pid).to_i)
    rescue Errno::ENOENT, Errno::ESRCH
      # プロセスが既に存在しない場合は無視
    end
  end

  # ソケットファイルが存在する場合は削除
  socket_path = "/home/ec2-user/evepos-project/event-post-api/tmp/sockets/unicorn.sock"
  if File.exist?(socket_path)
    File.unlink(socket_path)
  end
end

# フォーク後の処理
after_fork do |server, worker|
  # ActiveRecord の接続を再接続
  defined?(ActiveRecord::Base) and ActiveRecord::Base.establish_connection

  # ソケットファイルの権限を修正
  socket_path = "/home/ec2-user/evepos-project/event-post-api/tmp/sockets/unicorn.sock"
  File.chmod(0775, socket_path)
  File.chown(nil, Process.gid, socket_path)
end
