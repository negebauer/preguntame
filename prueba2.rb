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

url = URI("http://api.meaningcloud.com/sentiment-2.1")

http = Net::HTTP.new(url.host, url.port)

request = Net::HTTP::Post.new(url)
request["content-type"] = 'application/x-www-form-urlencoded'
request.body = "key=68e8c30899c70cee783b176a3c6eb140&lang=es&txt=Hola como estas"

response = http.request(request)
puts response.read_body
