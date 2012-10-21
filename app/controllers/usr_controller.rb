class UsrController < ApplicationController
  def manage
  	if staff_signed_in?
  		redirect_to root_path, alert: "You are unauthorized to access this action."
  	else
  	end
  end

  def profile
  end

  def staff
  	@staff = User.where("role = ?", "staff")
  end
end
