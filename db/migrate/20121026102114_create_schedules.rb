class CreateSchedules < ActiveRecord::Migration
  def change
    create_table :schedules do |t|
      t.string :checkpoint
      t.string :lesson
      t.string :subject
      t.string :slug
      t.date :date

      t.timestamps
    end
    add_index :schedules, :slug, unique: true
  end
end
