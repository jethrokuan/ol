require 'faraday'
require 'csv'
require 'json'

class Gdoc
	def self.getresponse(url,model)
		response = Faraday.get url
		json = CSV.parse(response.body)

		#Get First Row (for headers)
		header_count = json[0].count
		i=0
		header = Array.new()

		for i in 0..header_count-1
			header[i] = json[0][i]
		end

		x = Hash.new()
		for j in 1..5
			x[j] = {"id" => json[j][0], "subject" => json[j][1]}
		end

		return x
	end
end