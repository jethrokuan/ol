class Lesson < ActiveRecord::Base
  attr_accessible :lesson, :order, :topic_id
  belongs_to :topic_id
  has_many :checkpoints
end
