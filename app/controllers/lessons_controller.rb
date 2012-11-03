class LessonsController < ApplicationController
  # GET /lessons
  # GET /lessons.json
  load_and_authorize_resource find_by: :slug
  skip_load_resource :only => :index
  skip_authorize_resource :only => :index
  
  def index
    @topic = Topic.find(params[:topic_id])
    @lessons = @topic.lessons

    respond_to do |format|
      format.html {render :layout => 'reveal'}
      format.json { render json: @lessons }
    end
  end

  def show
    @lesson = Lesson.find(params[:id])

    respond_to do |format|
      format.html {render :layout => 'reveal'}
      format.json { render json: @lesson }
    end
  end

  def new
    @lesson = Lesson.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @lesson }
    end
  end

  def edit
    @lesson = Lesson.find(params[:id])
  end

  def create
    @lesson = Lesson.new(params[:lesson])

    respond_to do |format|
      if @lesson.save
        format.html { redirect_to @lesson, notice: 'Lesson was successfully created.' }
        format.json { render json: @lesson, status: :created, location: @lesson }
      else
        format.html { render action: "new" }
        format.json { render json: @lesson.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    @lesson = Lesson.find(params[:id])

    respond_to do |format|
      if @lesson.update_attributes(params[:lesson])
        format.html { redirect_to @lesson, notice: 'Lesson was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @lesson.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @lesson = Lesson.find(params[:id])
    @lesson.destroy

    respond_to do |format|
      format.html { redirect_to edit_subject_path(@lesson.subject) }
      format.json { head :no_content }
    end
  end

  def showedit
    @lesson = Lesson.find(params[:id])
  end

  def sort
    params[:lesson].each_with_index do |id, index|
    Lesson.update_all({position: index+1}, {id: id})
  end
    render nothing: true
  end
end
