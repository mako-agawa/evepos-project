Rails.application.routes.draw do
  # APIのバージョニング (例えば v1 を定義)
  namespace :api do
    namespace :v1 do
      # ユーザーのルート
      resources :users, only: [:index, :show, :create, :update, :destroy]

      # イベントのルート
      resources :events do
        resources :comments, only: [:create, :destroy]  # イベントに対するコメントの作成と削除
        member do
          post 'like'  # like アクションを追加
        end
      end

      # ログイン、ログアウト
      post 'login', to: 'sessions#create'
      delete 'logout', to: 'sessions#destroy'

      # カスタムルート例 (APIには通常の `about` ページは不要かもしれません)
      # get 'about', to: 'pages#about'  # ページに関するルートはAPIモードでは不要な場合が多い
    end
  end
end
