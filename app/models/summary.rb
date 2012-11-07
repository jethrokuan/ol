class Summary < ActiveRecord::Base
  belongs_to :lesson
  attr_accessible :lesson_id, :position, :summary

  acts_as_list :scope => :lesson

  extend FriendlyId
  friendly_id :summary, use: :slugged
end
