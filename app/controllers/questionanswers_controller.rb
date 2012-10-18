class QuestionanswersController < ApplicationController
	def create
	    @questionanswer = Questionanswer.new(params[:questionanswer])

	    respond_to do |format|
			if @questionanswer.save
				format.html { redirect_to @questionanswer, notice: 'Question and Answer was successfully created.' }
				format.json { render json: @questionanswer, status: :created, location: @questionanswer }
			else
				format.html { render action: "new" }
				format.json { render json: @questionanswer.errors, status: :unprocessable_entity }
			end
	    end
	end
end
