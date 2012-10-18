class Questionanswer < ActiveRecord::Base
  attr_accessible :answer, :checkpoint_id, :question
  belongs_to :checkpoint
end
