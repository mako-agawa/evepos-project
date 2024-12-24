# ソケットの設定
bind "unix:///home/ec2-user/evepos-project/event-post-api/tmp/sockets/puma.sock"

# PIDファイル
pidfile "/home/ec2-user/evepos-project/event-post-api/tmp/pids/puma.pid"

# スレッドとワーカーの設定
threads 1, 5
workers 2

# ログファイル
stdout_redirect "/home/ec2-user/evepos-project/event-post-api/log/puma.stdout.log", "/home/ec2-user/evepos-project/event-post-api/log/puma.stderr.log", true

# デーモン化
daemonize false

preload_app!
