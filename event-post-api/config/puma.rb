workers ENV.fetch('WEB_CONCURRENCY') { 2 }
threads_count = ENV.fetch('RAILS_MAX_THREADS') { 5 }
threads threads_count, threads_count

preload_app!

# Pumaが待ち受けるポートを指定
# 既存のポート設定を削除し、SSLバインディングを記述
bind 'ssl://127.0.0.1:3001?key=/etc/letsencrypt/live/api.evepos.net/privkey.pem&cert=/etc/letsencrypt/live/api.evepos.net/fullchain.pem'

# 環境設定
environment ENV.fetch('RAILS_ENV') { 'production' }

# PIDファイルの場所を指定
pidfile ENV.fetch('PIDFILE') { 'tmp/pids/server.pid' }

# 再起動用のプラグインを有効化
plugin :tmp_restart
