class User < ActiveRecord::Base
  def admin?
    false
  end
  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable,
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

	ROLES = %w[user staff]

  attr_accessible :email, :password, :password_confirmation, :remember_me, :role, :school_year, :school, :surname, :givenname, :checkpoint_id, :subject_ids
  
  def fullname
    return givenname+" "+surname
  end
end
