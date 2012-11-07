class CreateSummaries < ActiveRecord::Migration
  def change
    create_table :summaries do |t|
      t.string :summary
      t.integer :position
      t.integer :lesson_id
      t.string :slug

      t.timestamps
    end
    add_index :summaries, :slug, unique: true
  end
end
