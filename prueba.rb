require 'rubygems'
require 'twitter'
#require 'unirest'

#require 'active_support/inflector'

client = Twitter::REST::Client.new do |config|
  config.consumer_key        = "jG4IFhzllIJCJDCKEoY8s1IFI"
  config.consumer_secret     = "1hsqWBEWOQLwk7v708PYIstw6DgJE9wFVlYcENXW5nYnayULpw"
  config.access_token        = "109609974-QonFgD89kFYEFfHF8mUwml7xXlCsuUrAJhZSyHRq"
  config.access_token_secret = "eTAxguM6b0IZV0yOJ6VF7K7V6ocygs6GmGWtpdIBEIhiT"
end


client.search("eurocopa", result_type: "today").take(1).collect do |tweet|
  puts tweet.full_text

end
