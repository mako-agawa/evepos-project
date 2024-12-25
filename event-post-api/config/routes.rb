Rails.application.routes.draw do
  root to: proc { [200, { 'Content-Type' => 'text/plain' }, ['OK']] }
  get '/health_check', to: proc { [200, { 'Content-Type' => 'text/plain' }, ['OK']] }
  
  namespace :api do
    namespace :v1 do
      root 'events#index' # 例：Events コントローラの index アクションをルートに設定
      # ユーザーリソース
      resources :users, only: [:index, :show, :create, :update, :destroy], defaults: { format: :json }
      get '/current_user', to: 'users#current_user', defaults: { format: :json }

      # イベントリソース
      resources :events, defaults: { format: :json } do
        # コメントリソースをネスト
        resources :comments, only: %i[index create destroy], defaults: { format: :json }

        # いいね機能
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
