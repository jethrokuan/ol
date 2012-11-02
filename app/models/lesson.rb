class Lesson < ActiveRecord::Base
  attr_accessible :lesson, :position, :topic_id, :is_sublesson, :staff_id
  belongs_to :topic
  acts_as_list :scope => :topic
  belongs_to :staff
  has_many :checkpoints, :order => :position
  has_many :summaries, :order => :position

  extend FriendlyId
  friendly_id :lesson, use: :slugged
end
