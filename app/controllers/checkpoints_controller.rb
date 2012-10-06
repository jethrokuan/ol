class CheckpointsController < ApplicationController
  # GET /checkpoints
  # GET /checkpoints.json
  def index
    @checkpoints = Checkpoint.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @checkpoints }
    end
  end

  # GET /checkpoints/1
  # GET /checkpoints/1.json
  def show
    @checkpoint = Checkpoint.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @checkpoint }
    end
  end

  # GET /checkpoints/new
  # GET /checkpoints/new.json
  def new
    @checkpoint = Checkpoint.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @checkpoint }
    end
  end

  # GET /checkpoints/1/edit
  def edit
    @checkpoint = Checkpoint.find(params[:id])
  end

  # POST /checkpoints
  # POST /checkpoints.json
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

  # PUT /checkpoints/1
  # PUT /checkpoints/1.json
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

  # DELETE /checkpoints/1
  # DELETE /checkpoints/1.json
  def destroy
    @checkpoint = Checkpoint.find(params[:id])
    @checkpoint.destroy

    respond_to do |format|
      format.html { redirect_to checkpoints_url }
      format.json { head :no_content }
    end
  end
end
