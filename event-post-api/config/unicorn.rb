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


before_fork do |server, worker|
  # ソケットファイルの削除と作成時の権限設定
  socket_path = "/home/ec2-user/evepos-project/event-post-api/tmp/sockets/unicorn.sock"
  if File.exist?(socket_path)
    File.unlink(socket_path)
  end
  File.umask(0002) # グループに書き込み権限を与える
end

after_fork do |server, worker|
  # ソケットファイルの所有者とグループを nginx に設定
  socket_path = "/home/ec2-user/evepos-project/event-post-api/tmp/sockets/unicorn.sock"
  File.chown(nil, Process.gid, socket_path)
  File.chmod(0775, socket_path)
end
