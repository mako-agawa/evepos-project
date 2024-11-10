# frozen_string_literal: true

Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :users, only: [:index, :show, :create, :update, :destroy]
      get '/current_user', to: 'users#current_user' # 現在のユーザーを取得するエンドポイント

      resources :events do
        resources :comments, only: %i[index create destroy] # コメントにindexを追加
        member do
          post 'like'
        end
      end

      resources :sessions, only: %i[create destroy] # sessionsリソースのルート設定
    end
  end
end
