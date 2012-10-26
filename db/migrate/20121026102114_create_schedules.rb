class CreateSchedules < ActiveRecord::Migration
  def change
    create_table :schedules do |t|
      t.string :checkpoint
      t.string :lesson
      t.string :subject
      t.datetime :date

      t.timestamps
    end
  end
end
