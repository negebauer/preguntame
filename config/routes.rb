Rails.application.routes.draw do

  get 'ask/home'
  post 'ask/respond'

  root 'ask#home'

end
