class Checkpoint < ActiveRecord::Base
  attr_accessible :checkpoint, :description, :lesson_id, :objective, :order, :qaarray, :videourl
  has_many :questionanswers
  belongs_to :lesson

  extend FriendlyId
  friendly_id :checkpoint, use: :slugged
end
