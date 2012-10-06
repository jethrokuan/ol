class Checkpoint < ActiveRecord::Base
  attr_accessible :checkpoint, :description, :lesson_id, :objective, :order, :qaarray, :videourl
  serialize :qaarray, Hash
  belongs_to :lesson
end
