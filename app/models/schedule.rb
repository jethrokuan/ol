class Schedule < ActiveRecord::Base
  attr_accessible :checkpoint, :date, :lesson, :subject
  extend FriendlyId
  friendly_id :checkpoint, use: :slugged
end
