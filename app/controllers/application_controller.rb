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

	#Change default sign_in and out path to previous path
  def after_sign_in_path_for(resource)                                                                                                                      
    sign_in_url = url_for(:action => 'new', :controller => 'sessions', :only_path => false, :protocol => 'http')                                            
    if request.referer == sign_in_url                                                                                                                    
      super                                                                                                                                                 
    else                                                                                                                                                    
      stored_location_for(resource) || request.referer || root_path                                                                                         
    end                                                                                                                                                     
  end

  def after_sign_out_path_for(resource_or_scope)
  request.referrer
end
end
