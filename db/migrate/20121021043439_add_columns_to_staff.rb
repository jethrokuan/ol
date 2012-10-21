class AddColumnsToStaff < ActiveRecord::Migration
  def change
    add_column :staffs, :title, :string
    add_column :staffs, :phone, :string
    add_column :staffs, :givenname, :string
    add_column :staffs, :surname, :string
    add_column :staffs, :school, :string
  end
end
