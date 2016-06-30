class Api::V1::QuestionController < Api::V1::ApiController
    require 'rubygems'
    require 'twitter'
    require 'uri'
    require 'net/http'
    require 'json'

    before_action :stop_words_check
    before_action :stop_words_load
    before_action :config_twitter

    @@stop_words = []
    @@client = nil

    def question
        question = params.require('question')

        filter = Stopwords::Filter.new @@stop_words
        data = filter.filter question.split
        tweets = tweets_for_question(data.join(' '))
        retweets = tweets_retweeted(tweets, 3)
        score, confidence = tweets_data(tweets)

        render json: { 'retweets': retweets, 'score': score, 'confidence': confidence }
    end


    def question_fixed
        mensaje = ""
        @@client.search("chile",locations: "-109.460,-66.420,-55.980,-17.510" ,result_type: "today", :lang => "es").take(100).collect do |tweet|
            mensaje = mensaje + tweet.full_text.to_s + "\n"
        end
        url = URI("http://api.meaningcloud.com/sentiment-2.1")
        http = Net::HTTP.new(url.host, url.port)

        request = Net::HTTP::Post.new(url)
        request["content-type"] = 'application/x-www-form-urlencoded'
        request.body = "key=68e8c30899c70cee783b176a3c6eb140&lang=es&txt=#{mensaje}"

        response = http.request(request)
        data =  JSON.parse(response.body)
        image = data[:score_tag] + '.png'

        render json: { 'response': image }
    end

    private

    def tweets_for_question(question)
        @@client.search(question, result_type: "today").take(10).collect
        # {tweet.full_text}:#{tweet.retweet_count},#{tweet.favorite_count}"
        # tweets[0...3].map { |t| { 'text': t.full_text } }
    end

    def tweets_retweeted(tweets, amount = 3)
        (tweets.sort_by { |t| t.retweet_count }.reverse)[0...amount].map { |t| { 'text': t.full_text } }
    end

    def tweets_data(tweets)
        message = ""
        tweets.each { |t| message += t.full_text + "\n" }
        url = URI('http://api.meaningcloud.com/sentiment-2.1')

        http = Net::HTTP.new(url.host, url.port)

        request = Net::HTTP::Post.new(url)
        request['content-type'] = 'application/x-www-form-urlencoded'
        request.body = "key=68e8c30899c70cee783b176a3c6eb140&lang=es&txt=#{message}"

        response = http.request(request)
        data = JSON.parse(response.body)
        return data['score_tag'], data['confidence']
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
                config.access_token        = "109609974-LgXglwk0qrQGSM0kAlfsXFQntmr6vPtBKkPTFIgY"
                config.access_token_secret = "gYWOfI2n7YJrv9wdLmx1aeO9kajtSl93IgMM2muu0GMmE"
            end
        end
    end

end
