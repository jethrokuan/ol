class ErrorController < ApplicationController
	def handle404
		render layout: "reveal"
	end
end
