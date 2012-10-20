class UsrController < ApplicationController
  def manage
  end

  def profile
  end

  def staff
  	@staff = User.where("role = ?", "staff")
  end
end
