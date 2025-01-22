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
        # コメントリソースをネスト
        resources :comments, only: %i[index create destroy], defaults: { format: :json }

        # いいね機能（必要なら有効化）
        # member do
        #   post 'like', to: 'likes#create'
        #   delete 'like', to: 'likes#destroy'
        # end
      end

      # セッション管理
      resources :sessions, only: %i[create destroy], defaults: { format: :json }

    end
  end
end
