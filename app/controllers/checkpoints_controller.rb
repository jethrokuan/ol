class CheckpointsController < ApplicationController
  load_and_authorize_resource find_by: :slug
  skip_load_resource :only => :index
  skip_authorize_resource :only => :index
  
  def index
    respond_to do |format|
      format.json { render json: Checkpoint.all }
    end
  end

  def show
    @checkpoint = Checkpoint.find(params[:id])
    @questionanswer = @checkpoint.questionanswers.new
    @summary = @checkpoint.lesson.summaries.new

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @checkpoint }
    end
  end

  def new
    @checkpoint = Checkpoint.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @checkpoint }
    end
  end

  def edit
    @checkpoint = Checkpoint.find(params[:id])
  end

  def create
    @checkpoint = Checkpoint.new(params[:checkpoint])

    respond_to do |format|
      if @checkpoint.save
        format.html { redirect_to @checkpoint, notice: 'Checkpoint was successfully created.' }
        format.json { render json: @checkpoint, status: :created, location: @checkpoint }
      else
        format.html { render action: "new" }
        format.json { render json: @checkpoint.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    @checkpoint = Checkpoint.find(params[:id])

    respond_to do |format|
      if @checkpoint.update_attributes(params[:checkpoint])
        format.html { redirect_to @checkpoint, notice: 'Checkpoint was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @checkpoint.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @checkpoint = Checkpoint.find(params[:id])
    @checkpoint.destroy

    respond_to do |format|
      format.html { redirect_to checkpoints_url }
      format.json { head :no_content }
    end
  end

  def sort
    params[:checkpoint].each_with_index do |id, index|
    Checkpoint.update_all({position: index+1}, {id: id})
  end
    render nothing: true
  end
end
