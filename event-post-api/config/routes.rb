# frozen_string_literal: true

# config/routes.rb
Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :users, only: [:index, :show, :create, :update, :destroy]
    get '/current_user', to: 'users#current_user' # 現在のユーザーを取得するエンドポイント
      resources :events do
        resources :comments, only: %i[create destroy]
        member do
          post 'like'
        end
      end
      # sessionsリソースのルート設定
      resources :sessions, only: %i[create destroy]
    end
  end
end
