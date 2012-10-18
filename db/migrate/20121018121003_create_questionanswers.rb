class CreateQuestionanswers < ActiveRecord::Migration
  def change
    create_table :questionanswers do |t|
      t.text :qusetion
      t.text :answer
      t.integer :checkpoint_id

      t.timestamps
    end
  end
end
