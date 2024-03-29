class Api::ApiController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :null_session

  def index
      render json: { 'version': 'v1', 'status': 'ok' }
  end
end
