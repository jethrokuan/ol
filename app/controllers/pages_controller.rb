class PagesController < ApplicationController
	def index
		@subjects = Subject.all
	end

	def team
		@thumbs = Dir.glob('app/assets/images/profile/*')
	end

	def opportunities
	end

	def partners
	end

	def presskit
	end

	def contact
	end
	
	def test
		respond_to do |format|
		format.json {render json: Gdoc.getresponse("https://docs.google.com/spreadsheet/pub?key=0AgaMT0yBV-pKdDlBM1h3S3VhaUR0T1JJU3RiS1lGV2c&output=csv", Subject)}
		end
	end
end
