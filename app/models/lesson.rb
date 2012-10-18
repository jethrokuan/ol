class Lesson < ActiveRecord::Base
  attr_accessible :lesson, :order, :topic_id, :is_sublesson
  belongs_to :topic
  has_many :checkpoints

  extend FriendlyId
  friendly_id :lesson, use: :slugged
end
