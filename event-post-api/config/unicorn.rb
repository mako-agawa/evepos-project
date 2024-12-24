# ソケットの設定
listen "/home/ec2-user/evepos-project/event-post-api/tmp/sockets/unicorn.sock", backlog: 64
worker_processes 2
timeout 30
preload_app true

# PIDファイル
pid "/home/ec2-user/evepos-project/event-post-api/tmp/pids/unicorn.pid"

# ログファイル
stderr_path "/home/ec2-user/evepos-project/event-post-api/log/unicorn.stderr.log"
stdout_path "/home/ec2-user/evepos-project/event-post-api/log/unicorn.stdout.log"

before_fork do |server, worker|
  old_pid = "#{server.config[:pid]}.oldbin"
  if File.exist?(old_pid) && server.pid != old_pid
    begin
      Process.kill("QUIT", File.read(old_pid).to_i)
    rescue Errno::ENOENT, Errno::ESRCH
    end
  end

  # ソケットファイルの存在を確認し、削除
  socket_path = "/home/ec2-user/evepos-project/event-post-api/tmp/sockets/unicorn.sock"
  if File.exist?(socket_path)
    File.unlink(socket_path)
  end
end

after_fork do |server, worker|
  # ソケットファイルの権限を設定
  socket_path = "/home/ec2-user/evepos-project/event-post-api/tmp/sockets/unicorn.sock"
  File.chmod(0775, socket_path) if File.exist?(socket_path)
end
