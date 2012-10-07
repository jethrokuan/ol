class Lesson < ActiveRecord::Base
  attr_accessible :lesson, :order, :topic_id
  belongs_to :topic
  has_many :checkpoints
end
