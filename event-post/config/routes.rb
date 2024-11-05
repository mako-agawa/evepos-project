# frozen_string_literal: true

# config/routes.rb
Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :users, only: %i[index show create update destroy]
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
