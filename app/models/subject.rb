class Subject < ActiveRecord::Base
  attr_accessible :subject
  has_many :topics
  has_many :lessons, through: :topics
  has_many :checkpoints, through: :topics

  extend FriendlyId
  friendly_id :subject, use: :slugged
end
