Rails.application.routes.draw do

  get 'ask/home'
  post 'ask/respond'

  root 'ask#home'

  namespace :api do
      root 'api#index'
      namespace :v1 do
          root 'api#index'
          post 'question', to: 'question'
      end
  end

end
