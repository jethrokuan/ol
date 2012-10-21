class AddFieldsToUsers < ActiveRecord::Migration
  def change
  	add_column :users, :surname, :string
  	add_column :users, :givenname, :string
  	add_column :users, :school, :string
  	add_column :users, :school_year, :string
  end
end
