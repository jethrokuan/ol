class CreateSchedules < ActiveRecord::Migration
  def change
    create_table :schedules do |t|
      t.string :checkpoint
      t.string :lesson
      t.string :subject
      t.date :date

      t.timestamps
    end
  end
end
