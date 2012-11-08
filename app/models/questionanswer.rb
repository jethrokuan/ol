class Questionanswer < ActiveRecord::Base
  attr_accessible :answer, :checkpoint_id, :question
  belongs_to :checkpoint
  
  validates_presence_of :answer,:question, :checkpoint_id
end
