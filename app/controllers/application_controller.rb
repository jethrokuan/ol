class ApplicationController < ActionController::Base
	protect_from_forgery
	rescue_from CanCan::AccessDenied do |exception|
		flash[:alert] = "Access denied. You are not logged in as a member of openlectures, or you are not a member of openlectures."
		redirect_to root_url
	end
end
