class Api::V1::ApiController < Api::ApiController

  def index
      render json: { 'status': 'ok' }
  end

end
