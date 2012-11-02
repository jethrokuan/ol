class SummariesController < ApplicationController
  # GET /summaries
  # GET /summaries.json
  def index
    @summaries = Summary.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @summaries }
    end
  end

  # GET /summaries/1
  # GET /summaries/1.json
  def show
    @summary = Summary.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @summary }
    end
  end

  # GET /summaries/new
  # GET /summaries/new.json
  def new
    @summary = Summary.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @summary }
    end
  end

  # GET /summaries/1/edit
  def edit
    @summary = Summary.find(params[:id])
  end

  # POST /summaries
  # POST /summaries.json
  def create
    @summary = Summary.new(params[:summary])

    respond_to do |format|
      if @summary.save
        format.html { redirect_to @summary, notice: 'Summary was successfully created.' }
        format.json { render json: @summary, status: :created, location: @summary }
      else
        format.html { render action: "new" }
        format.json { render json: @summary.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /summaries/1
  # PUT /summaries/1.json
  def update
    @summary = Summary.find(params[:id])

    respond_to do |format|
      if @summary.update_attributes(params[:summary])
        format.html { redirect_to @summary, notice: 'Summary was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @summary.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /summaries/1
  # DELETE /summaries/1.json
  def destroy
    @summary = Summary.find(params[:id])
    @summary.destroy

    respond_to do |format|
      format.html { redirect_to summaries_url }
      format.json { head :no_content }
    end
  end
end
