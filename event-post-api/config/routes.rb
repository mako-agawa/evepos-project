Rails.application.routes.draw do
  # デフォルトのルート
  root to: proc { [200, { 'Content-Type' => 'text/plain' }, ['OK']] }

  # ヘルスチェック用
  get '/health_check', to: ->(_env) { [200, { 'Content-Type' => 'text/plain' }, ['OK']] }

  # APIエンドポイント
  namespace :api do
    namespace :v1 do
      # ユーザーリソース
      resources :users, only: %i[index show create update destroy], defaults: { format: :json }
      get '/current_user', to: 'users#me', defaults: { format: :json }

      # イベントリソース
      resources :events, defaults: { format: :json } do
        collection do
          get 'schedule', to: 'events#schedule'
          get 'archive', to: 'events#archive'
          get 'liked/:user_id', to: 'events#user_liked'
          get 'search', to: 'events#search'
        end
        resources :comments, only: %i[index create destroy], defaults: { format: :json }
        resources :likes, only: %i[index create destroy], defaults: { format: :json }
      end

      # セッション管理
      resources :sessions, only: %i[create destroy], defaults: { format: :json }
    end
  end

  # Active Storageのルーティング
  mount ActiveStorage::Engine => '/rails/active_storage'
end
