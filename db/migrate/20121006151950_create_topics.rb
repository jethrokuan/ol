class CreateTopics < ActiveRecord::Migration
  def change
    create_table :topics do |t|
      t.string :topic
      t.integer :subject_id
      t.integer :order
      t.boolean :is_subtopic
      t.text :description

      t.timestamps
    end
  end
end
