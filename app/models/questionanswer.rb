class Questionanswer < ActiveRecord::Base
  attr_accessible :answer, :checkpoint_id, :qusetion
  belongs_to :checkpoint
end
