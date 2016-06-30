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

client = Twitter::REST::Client.new do |config|
    config.consumer_key = 'jG4IFhzllIJCJDCKEoY8s1IFI'
    config.consumer_secret     = '1hsqWBEWOQLwk7v708PYIstw6DgJE9wFVlYcENXW5nYnayULpw'
    config.access_token        = '109609974-LgXglwk0qrQGSM0kAlfsXFQntmr6vPtBKkPTFIgY'
    config.access_token_secret = 'gYWOfI2n7YJrv9wdLmx1aeO9kajtSl93IgMM2muu0GMmE'
end

i = 0
messages = ''
ids = ''
client.search('noche', result_type: 'today').take(1000).collect do |tweet|
    messages = messages + tweet.full_text.gsub("\n", ' ') + "\n"
    ids = ids + i.to_s + "\n"
    i += 1
end

puts messages
puts ids
