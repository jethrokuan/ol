class Subject < ActiveRecord::Base
  attr_accessible :subject
  has_many :topics, :order => :position
  has_many :lessons, through: :topics
  has_many :checkpoints, through: :lessons

  validates_presence_of :subject
  extend FriendlyId
  friendly_id :subject, use: :slugged
  
end
