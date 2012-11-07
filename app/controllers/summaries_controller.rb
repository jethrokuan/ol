class SummariesController < ApplicationController
  respond_to :json, :html
  def index
    @summaries = Summary.all
    respond_with @summaries
  end

  def new
    @summary = Summary.new
    respond_with @summary
  end

  def edit
    @summary = Summary.find(params[:id])
  end

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

  def destroy
    @summary = Summary.find(params[:id])
    @summary.destroy

    respond_to do |format|
      format.html { redirect_to summaries_url }
      format.json { head :no_content }
    end
  end

  def sort
    params[:checkpoint].each_with_index do |id, index|
    Summary.update_all({position: index+1}, {id: id})
  end
    render nothing: true
  end
end
