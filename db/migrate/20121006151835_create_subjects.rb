class CreateSubjects < ActiveRecord::Migration
  def change
    create_table :subjects do |t|
      t.string :subject
      t.string :slug

      t.timestamps
    end
    add_index :subjects, :slug, unique: true
  end
end
