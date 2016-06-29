Rails.application.routes.draw do
    get 'ask/home'
    root 'ask#home'

    namespace :api do
        root 'api#index'
        namespace :v1 do
            root 'api#index'
            post 'question', controller: 'question'
        end
    end
end
