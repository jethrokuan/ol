class Checkpoint < ActiveRecord::Base
  attr_accessible :checkpoint, :description, :lesson_id, :objective, :position, :videourl
  has_many :questionanswers
  belongs_to :lesson

  acts_as_list :scope => :lesson

  extend FriendlyId
  friendly_id :checkpoint, use: :slugged
end
