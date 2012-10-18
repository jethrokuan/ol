class CreateCheckpoints < ActiveRecord::Migration
  def change
    create_table :checkpoints do |t|
      t.string :checkpoint
      t.integer :lesson_id
      t.text :description
      t.string :videourl
      t.text :objective
      t.text :qaarray
      t.integer :order
      t.string :slug

      t.timestamps
    end
    add_index :checkpoints, :slug, unique: true
  end
end
