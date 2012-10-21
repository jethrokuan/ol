class ApplicationController < ActionController::Base
	protect_from_forgery

	rescue_from CanCan::AccessDenied do |exception|
		flash[:alert] = "Access denied. You are not logged in as a member of openlectures, or you are not a member of openlectures."
		redirect_to root_url
	end

	def current_auth_resource
		  if staff_signed_in?
		    current_staff
		  else
		    current_user
		  end
		end

	def current_ability
	    @current_ability or @current_ability = Ability.new(current_auth_resource)
	end
end
