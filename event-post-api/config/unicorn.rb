# unicorn.rb

working_directory "/home/ec2-user/evepos-project/event-post-api"

# PIDファイルのパス
pid "/home/ec2-user/evepos-project/event-post-api/tmp/pids/unicorn.pid"

stderr_path "/home/ec2-user/evepos-project/event-post-api/log/unicorn.stderr.log"
stdout_path "/home/ec2-user/evepos-project/event-post-api/log/unicorn.stdout.log"

listen "/home/ec2-user/evepos-project/event-post-api/tmp/sockets/unicorn.sock"
worker_processes 2
timeout 30
preload_app true

before_fork do |server, worker|
  defined?(ActiveRecord::Base) and ActiveRecord::Base.connection.disconnect!
end

after_fork do |server, worker|
  defined?(ActiveRecord::Base) and ActiveRecord::Base.establish_connection
end
