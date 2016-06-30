# require 'unirest'
#
# response = Unirest.post "https://api.meaningcloud.com/sentiment-2.1",
# headers: { "Content-Type": "application/x-www-form-urlencoded" },
# parameters:{
#   key: "68e8c30899c70cee783b176a3c6eb140",
#   lang: "es",
#   txt: "Hola como estas"
# }
#
# puts response.raw_body

require 'uri'
require 'net/http'
require 'json'
require 'twitter'

mensaje = ""
client = Twitter::REST::Client.new do |config|
  config.consumer_key        = "jG4IFhzllIJCJDCKEoY8s1IFI"
  config.consumer_secret     = "1hsqWBEWOQLwk7v708PYIstw6DgJE9wFVlYcENXW5nYnayULpw"
  config.access_token        = "109609974-LgXglwk0qrQGSM0kAlfsXFQntmr6vPtBKkPTFIgY"
  config.access_token_secret = "gYWOfI2n7YJrv9wdLmx1aeO9kajtSl93IgMM2muu0GMmE"
end


client.search("eurocopa", result_type: "today").take(50).collect do |tweet|
  texto = tweet.full_text.split(" ")
  texto.each do |palabra|
    if palabra.include? 'https'
      puts palabra + ' BLABLABLAL'
      texto.delete(palabra)
    end
  end
  texto = texto.join(" ")
  mensaje = mensaje + texto + "\n"
end


url = URI("http://api.meaningcloud.com/sentiment-2.1")

http = Net::HTTP.new(url.host, url.port)

request = Net::HTTP::Post.new(url)
request["content-type"] = 'application/x-www-form-urlencoded'
request.body = "key=68e8c30899c70cee783b176a3c6eb140&lang=es&txt=#{mensaje}"

response = http.request(request)
#puts response.read_body
data =  JSON.parse(response.body)


pos = 0
neu = 0
neg = 0
strongpos = 0
strongneg = 0

items = {}

respuesta_general = data["score_tag"]
seguridad = data["confidence"]
data["sentence_list"].each do |tweet|
  case tweet["score_tag"]
  when "P"
    pos += 1
  when "P+"
    strongpos += 1
  when "NEU"
    neu += 1
  when "N"
    neg +=1
  when "N+"
    strongneg += 1
  end
  #temas
  tweet["segment_list"].each do |uno|
    uno["polarity_term_list"].each do |dos|
      if !dos["sentimented_concept_list"].nil?
        dos["sentimented_concept_list"].each do |key|
          if items.keys.include? key["form"]
            items[key["form"]] +=1
          else
            items[key["form"]] = 1
          end
        end
      end
      if !dos["sentimented_entity_list"].nil?
        dos["sentimented_entity_list"].each do |item|
          if items.keys.include? item["form"]
            items[item["form"]] +=1
          else
            items[item["form"]] = 1
          end
        end
      end
    end
  end

end

puts items
