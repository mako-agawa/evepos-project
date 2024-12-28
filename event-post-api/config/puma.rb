workers ENV.fetch('WEB_CONCURRENCY') { 2 }
threads_count = ENV.fetch('RAILS_MAX_THREADS') { 5 }
threads threads_count, threads_count

preload_app!

# Pumaが待ち受けるHTTPポートを指定
bind 'tcp://0.0.0.0:80'

# 環境設定
environment ENV.fetch('RAILS_ENV') { 'production' }

# PIDファイルの場所を指定
pidfile ENV.fetch('PIDFILE') { 'tmp/pids/server.pid' }

# 再起動用のプラグインを有効化
plugin :tmp_restart
