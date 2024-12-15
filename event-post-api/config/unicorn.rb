app_path = '/home/ec2-user/evepos-project/event-post-api'

worker_processes 2
working_directory app_path

stderr_path File.join(app_path, 'log', 'unicorn.stderr.log')
stdout_path File.join(app_path, 'log', 'unicorn.stdout.log')

listen File.join(app_path, 'tmp', 'sockets', 'unicorn.sock'), backlog: 64
pid File.join(app_path, 'tmp', 'pids', 'unicorn.pid')

timeout 60
preload_app true

before_fork do |server, worker|
  defined?(ActiveRecord::Base) and ActiveRecord::Base.connection.disconnect!
end

after_fork do |server, worker|
  defined?(ActiveRecord::Base) and ActiveRecord::Base.establish_connection
end
