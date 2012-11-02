class CreateSummaries < ActiveRecord::Migration
  def change
    create_table :summaries do |t|
      t.string :summary
      t.integer :position
      t.integer :lesson_id

      t.timestamps
    end
  end
end
