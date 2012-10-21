class YoutubeController < ApplicationController
  def upload
  		client = YouTubeIt::Client.new(:username => "openlecturessg", :password =>  "tequilatequila", :dev_key => "AI39si5kvS-bEkdPPvkQ9MrLDlnN_julXKUHxNvVeqzMMpSloUShVhwhIsbDWdkHgyZDLTWmWwKJ6e8Zp0N23gWwJZx38_dINw")
  		@videos = client.my_videos
  end
end
