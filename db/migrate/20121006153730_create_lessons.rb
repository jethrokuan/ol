class CreateLessons < ActiveRecord::Migration
  def change
    create_table :lessons do |t|
      t.string :lesson
      t.integer :topic_id
      t.integer :order

      t.timestamps
    end
  end
end
