class Api::V1::QuestionController < Api::V1::ApiController

  def question
      question = params.require('question')
      render json: { 'question': question }
  end

end
