class Topic < ActiveRecord::Base
  attr_accessible :description, :is_subtopic, :position, :subject_id, :topic
  belongs_to :subject
  has_many :lessons, :order => :position

  extend FriendlyId
  friendly_id :topic, use: :slugged
end
