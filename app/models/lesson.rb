class Lesson < ActiveRecord::Base
  attr_accessible :lesson, :order, :topic_id, :is_sublesson, :staff_id
  belongs_to :topic
  belongs_to :staff
  has_many :checkpoints

  extend FriendlyId
  friendly_id :lesson, use: :slugged
end
