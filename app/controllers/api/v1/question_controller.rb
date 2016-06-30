class Api::V1::QuestionController < Api::V1::ApiController
    require 'rubygems'
    require 'twitter'

    before_action :stop_words_check
    before_action :stop_words_load
    before_action :config_twitter

    @@stop_words = []
    @@client = nil

    def question
        question = params.require('question')

        filter = Stopwords::Filter.new @@stop_words
        data = filter.filter question.split
        response = respond(data.join(' '))

        render json: { 'response': response }
    end

    private

    def respond(question)
        # response = []
        tweets = @@client.search(question, result_type: "today").take(10).collect
        tweets = tweets.sort_by { |t| t.retweet_count }
        tweets = tweets.reverse
        # @@client.search(question, result_type: "today").take(500).collect do |tweet|
        #   puts"#{tweet.full_text}:#{tweet.retweet_count},#{tweet.favorite_count}"
            # response.append(tweet.full_text)
        # end
        # tweets.map { |t| t.retweet_count }
        # tweets
        tweets[0...3].map { |t| t.uri.to_s }
    end

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

    def config_twitter
        if @@client.nil?
            @@client = Twitter::REST::Client.new do |config|
                config.consumer_key        = "jG4IFhzllIJCJDCKEoY8s1IFI"
                config.consumer_secret     = "1hsqWBEWOQLwk7v708PYIstw6DgJE9wFVlYcENXW5nYnayULpw"
                config.access_token        = "109609974-QonFgD89kFYEFfHF8mUwml7xXlCsuUrAJhZSyHRq"
                config.access_token_secret = "eTAxguM6b0IZV0yOJ6VF7K7V6ocygs6GmGWtpdIBEIhiT"
            end
        end
    end

end
