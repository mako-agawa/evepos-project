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
      # デフォルトのルート (必要に応じて変更可能)
      root 'events#index'

      # ユーザーリソース
      resources :users, only: %i[index show create update destroy], defaults: { format: :json }
      get '/current_user', to: 'users#current_user', defaults: { format: :json }

      # イベントリソース
      resources :events, defaults: { format: :json } do
        collection do
          get 'schedule', to: 'events#schedule'  # スケジュール取得エンドポイント
        end

        # コメントリソースをネスト
        resources :comments, only: %i[index create destroy], defaults: { format: :json }

        resource :likes, only: [:create, :destroy]
        member do
          post 'like', to: 'likes#create'
          delete 'like', to: 'likes#destroy'
        end
      end

      # セッション管理
      resources :sessions, only: %i[create destroy], defaults: { format: :json }
    end
  end
  # Active Storageのルーティング
  direct :rails_blob do |blob|
    route_for(:rails_blob, blob)
  end


  direct :rails_representation do |representation|
    route_for(:rails_representation, representation)
  end
end
