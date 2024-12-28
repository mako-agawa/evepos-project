workers ENV.fetch('WEB_CONCURRENCY') { 2 }
threads_count = ENV.fetch('RAILS_MAX_THREADS') { 5 }
threads threads_count, threads_count

preload_app!

# rackup DefaultRackup は削除
port ENV.fetch('PORT') { 3001 }
environment ENV.fetch('RAILS_ENV') { 'production' }

pidfile ENV.fetch('PIDFILE') { 'tmp/pids/server.pid' }
plugin :tmp_restart
