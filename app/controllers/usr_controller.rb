class UsrController < ApplicationController
  def manage
  	if staff_signed_in?
  	else
      redirect_to root_path, alert: "You are unauthorized to access this action."
  	end
  end

  def profile
  end

  def staff
  	@staff = Staff.all
  end
end
