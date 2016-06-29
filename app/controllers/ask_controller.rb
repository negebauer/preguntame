class AskController < ApplicationController
  before_action :stop_words_check
  before_action :stop_words_load

  @@stop_words = []

  def home

  end

  def respond
    # HACER REQUEST A LA WEA
    # USAR JAVASCRIPT PARA MOSTRAR RESPUESTA
    question = params.require(:question)
    filter = Stopwords::Filter.new @@stop_words
    data = filter.filter question.split

    puts '----- LEEME -----'
    puts question
    respond_to do |format|
        format.html { render body: 'Respuesta para "' + question + '"' }
        format.js {'js'}
        format.json { 'json' }
    end
  end

  private

  def stop_words_check
    if @@stop_words.empty?
      stop_words_read
    end
  end

  def stop_words_load
    @stop_words = @@stop_words
  end

  def stop_words_read
    File.open("stopwords_es-2.txt", "r").each_line do |line|
      @@stop_words << line.strip
    end
  end
end
