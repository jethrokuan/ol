class Topic < ActiveRecord::Base
  attr_accessible :description, :is_subtopic, :order, :subject_id, :topic
  belongs_to :subject
  has_many :lessons

  extend FriendlyId
  friendly_id :topic, use: :slugged
end
