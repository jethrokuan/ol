class Staff < ActiveRecord::Base
  has_many :lessons
  def admin?
    true
  end
  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable,
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :password, :password_confirmation, :remember_me, :title, :givenname, :surname, :school, :phone
  # attr_accessible :title, :body

  def fullname
    return givenname+" "+surname
  end
end
