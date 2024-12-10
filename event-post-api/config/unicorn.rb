# config/unicorn.rb
# 環境変数からワーカー数を取得（デフォルトは4）
worker_processes Integer(ENV['WEB_CONCURRENCY'] || 4)

# アプリケーションのルートディレクトリ（デプロイ先のパスに変更）
app_path = File.expand_path("../../current", __FILE__)
working_directory app_path

# ポートの指定 (AWSのロードバランサーからの接続を受ける)
listen Integer(ENV['PORT'] || 3000), tcp_nopush: true

# PIDファイルの場所 (AWS EC2での標準的なディレクトリ)
pid "#{app_path}/tmp/pids/unicorn.pid"

# ログの出力先 (AWSではEC2の/var/log/に出すこともあります)
stderr_path "#{app_path}/log/unicorn.stderr.log"
stdout_path "#{app_path}/log/unicorn.stdout.log"

# プリロードでダウンタイムを防ぐ (zero-downtime deployのため)
preload_app true

# before_forkでActiveRecordの接続を閉じる（重要！）
before_fork do |server, worker|
  Signal.trap 'TERM' do
    puts 'Unicorn master intercepting TERM and sending myself QUIT instead'
    Process.kill 'QUIT', Process.pid
  end

  # ActiveRecordの接続をクローズ
  if defined?(ActiveRecord::Base)
    ActiveRecord::Base.connection.disconnect!
    puts 'Disconnected from ActiveRecord'
  end
end

# after_forkでActiveRecordの接続を再確立
after_fork do |server, worker|
  Signal.trap 'TERM' do
    puts 'Unicorn worker intercepting TERM and doing nothing. Wait for master to send QUIT'
  end

  # ActiveRecordの接続をリセット (データベース接続を再確立)
  if defined?(ActiveRecord::Base)
    ActiveRecord::Base.establish_connection
    puts 'Connected to ActiveRecord'
  end
end
