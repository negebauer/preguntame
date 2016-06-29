class AskController < ApplicationController

  def home

  end

  def respond
    # HACER REQUEST A LA WEA
    # USAR JAVASCRIPT PARA MOSTRAR RESPUESTA
    question = params.require(:question)
    puts '----- LEEME -----'
    puts question
    respond_to do |format|
        format.html { render body: 'Respuesta para "' + question + '"' }
        format.js {'js'}
        format.json { 'json' }
    end
  end
end
