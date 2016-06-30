class AskController < ApplicationController
    def home
    end

    def versus
    end

    def questions
        @questions = Question.all
    end
end
