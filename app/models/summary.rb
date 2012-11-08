class Summary < ActiveRecord::Base
  belongs_to :lesson
  attr_accessible :lesson_id, :position, :summary

  acts_as_list :scope => :lesson
  validates_presence_of :lesson_id, :summary
  extend FriendlyId
  friendly_id :summary, use: :slugged
end
