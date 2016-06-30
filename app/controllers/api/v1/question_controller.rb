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
        data, score, confidence = tweets_data(tweets)
        # test_data(tweets)
        pos, neg, neu = tweets_scores(data)
        key_concepts = tweets_key_concepts(data).map { |key, val| key }
        scores = {'P' => 'Positivo', 'P+' => 'Muy positivo', 'N' => 'Negativo', 'N+' => 'Muy negativo', 'NEU' => 'Neutro', 'NONE' => 'No hay'}
        render json: { retweets: retweets, score: scores[score], confidence: confidence, pos: pos, neg: neg, neu: neu, key_concepts: key_concepts }
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
        @@client.search(question, result_type: "today").take(100).collect
    end

    def tweets_retweeted(tweets, amount = 3)
        tweets.sort_by { |t| t.retweet_count }.reverse[0...amount].map { |t| { 'text': t.full_text } }
    end

    # def test_data(tweets)
        # datas = []
        # tweets.each { |t|
        #     message = t.full_text.gsub("\n", ' ')
        #     url = URI('http://api.meaningcloud.com/sentiment-2.1')
        #
        #     http = Net::HTTP.new(url.host, url.port)
        #
        #     request = Net::HTTP::Post.new(url)
        #     request['content-type'] = 'application/x-www-form-urlencoded'
        #     request.body = "key=68e8c30899c70cee783b176a3c6eb140&lang=es&txt=#{message}"
        #
        #     response = http.request(request)
        #     datas.append(JSON.parse(response.body))
        #     sleep(0.2)
        # }
        # failed = 0
        # scores = {'P' => 0, 'P+' => 0, 'N' => 0, 'N+' => 0, 'NEU' => 0, 'NONE' => 0}
        # datas.each { |data|
        #     if data['score_tag'].nil?
        #         failed += 1
        #     else
        #         scores[data['score_tag']] += 1
        #     end
        # }
        # puts "---- POR SEPARADO -----"
        # puts scores
        # puts failed
    # end

    def tweets_data(tweets)
        message = ""
        tweets.each { |t| message += t.full_text.gsub("\n", ' ') + "\n" }

        url = URI('http://api.meaningcloud.com/sentiment-2.1')

        http = Net::HTTP.new(url.host, url.port)

        request = Net::HTTP::Post.new(url)
        request['content-type'] = 'application/x-www-form-urlencoded'
        request.body = "key=68e8c30899c70cee783b176a3c6eb140&lang=es&txt=#{message}"

        response = http.request(request)
        data = JSON.parse(response.body)
        return data, data['score_tag'], data['confidence']
    end

    def tweets_scores(data)
        scores = {'P' => 0, 'P+' => 0, 'N' => 0, 'N+' => 0, 'NEU' => 0, 'NONE' => 0}
        return 0, 0, 0 if data['sentence_list'].nil?
        data['sentence_list'].each { |tweet| scores[tweet['score_tag']] += 1 }
        puts '--- TODO JUNTO PUNTAJES ---'
        puts scores
        scores.delete('NONE')
        total = scores.map { |key, value| value }.inject(:+)
        return 0, 0, 0 if total == 0
        return 100*(scores['P'] + scores['P+'])/total, 100*(scores['N'] + scores['N+'])/total, 100*(scores['NEU'])/total
    end

    def tweets_key_concepts(data)
        items = {}
        data['sentence_list'].each { |tweet| tweet['segment_list'].each { |segment| segment['polarity_term_list'].each { |polarity|
            polarity['sentimented_concept_list'].each { |concept|
                key = concept['form']
                items[key].nil? ? items[key] = 1 : items[key] += 1
            } if !polarity['sentimented_concept_list'].nil?
            polarity['sentimented_entity_list'].each { |entity|
                key = entity['form']
                items[key].nil? ? items[key] = 1 : items[key] += 1
            } if !polarity['sentimented_entity_list'].nil?
        }}}
        return items
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
        @@stop_words << "\n"
        @@stop_words << "\r"
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
