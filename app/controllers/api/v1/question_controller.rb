class Api::V1::QuestionController < Api::V1::ApiController
    before_action :stop_words_check
    before_action :stop_words_load

    @@stop_words = []

    def question
        question = params.require('question')

        filter = Stopwords::Filter.new @@stop_words
        data = filter.filter question.split

        render json: { 'question': data }
    end

    private

    def stop_words_check
        stop_words_read if @@stop_words.empty?
    end

    def stop_words_load
        @stop_words = @@stop_words
    end

    def stop_words_read
        File.open('stopwords_es-2.txt', 'r').each_line do |line|
            @@stop_words << line.strip
        end
    end
end
