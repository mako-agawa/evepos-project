Rails.application.routes.draw do
  # デフォルトのルート
  root to: proc { [200, { 'Content-Type' => 'text/plain' }, ['OK']] }

  # ヘルスチェック用
  get '/health_check', to: proc { [200, { 'Content-Type' => 'text/plain' }, ['OK']] }

  # デバッグ用ルート
  get '/debug', to: proc { [200, { 'Content-Type' => 'text/plain' }, ['Debug endpoint reached']] }

  # APIエンドポイント
  namespace :api do
    namespace :v1 do
      root 'events#index'

      # ユーザーリソース
      resources :users, only: %i[index show create update destroy], defaults: { format: :json }
      get '/current_user', to: 'users#current_user', defaults: { format: :json }

      # イベントリソース
      resources :events, defaults: { format: :json } do
        collection do
          get 'schedule', to: 'events#schedule'
          get 'archive', to: 'events#archive'
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
