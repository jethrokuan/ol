#Introduction
The link to this markdown document can be found [here](http://escrito.herokuapp.com/029205300#markdown)

#Setting Up Your Environment
##Mac
1. [Homebrew](http://mxcl.github.com/homebrew/)

    Install Homebrew: `ruby -e "$(curl -fsSkL raw.github.com/mxcl/homebrew/go)"`

2. Xcode

    [Install Xcode from Mac App Store](http://itunes.apple.com/us/app/xcode/id497799835?ls=1&mt=12)
    
    Install command line tools for Xcode (Preferences > Downloads > Components)
    
3. RVM
###Ruby/Rails
Run this to install ruby: `\curl -L https://get.rvm.io | bash -s stable --ruby`
Follow Instructions Provided
Install ruby version 1.9.3: `rvm install 1.9.3`
Install Rails:`sudo gem install rails`
4. Database Management
	For Postgresql, we recommend [Postgress.app](postgresapp.com) for easy installation
	For database management, we recommend [Induction](http://inductionapp.com/)
	HEROKU FTW (Y)

##Windows
Jethro: Screw Windows
Kenneth: Really, who uses Winblows?!

#API
##Database Structure
subjects(id, subject)
topics (id, topic, subject_id, order, is_subtopic, description)
lessons (id, lesson, topic_id, order)
checkpoints (id, ,date, checkpoint, lesson_id, description, videourl, objective, qa_array, order)

users(id, user_id, surname, givenname, role, email, school, school_year, checkpoint_id, subject_ids) + oauth
