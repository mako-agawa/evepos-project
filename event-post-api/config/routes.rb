Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      # ユーザーリソース
      resources :users, only: [:index, :show, :create, :update, :destroy]
      get '/current_user', to: 'users#current_user' # 現在のユーザーを取得するエンドポイント
      get 'health_check', to: 'health_checks#index'
      # イベントリソース
      resources :events do
        # コメントリソースをネスト
        resources :comments, only: %i[index create destroy]

        # いいね機能
        # member do
        #   post 'like', to: 'likes#create'
        #   delete 'like', to: 'likes#destroy'
        # end
      end

      # セッション管理
      resources :sessions, only: %i[create destroy]
    end
  end
end
