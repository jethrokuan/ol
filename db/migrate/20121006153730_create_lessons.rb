class CreateLessons < ActiveRecord::Migration
  def change
    create_table :lessons do |t|
      t.string :lesson
      t.integer :topic_id
      t.boolean :is_sublesson, default: false
      t.integer :position
      t.string :slug
      t.integer :staff_id

      t.timestamps
    end
    add_index :lessons, :slug, unique: true
  end
end