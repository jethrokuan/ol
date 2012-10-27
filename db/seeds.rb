# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

Subject.create(subject: "Chemistry")
Subject.create(subject: "Economics")
Subject.create(subject: "Mathematics")
Subject.create(subject: "Literature")
Subject.create(subject: "Physics")
Subject.create(subject: "Biology")
Subject.create(subject: "Life")

#Economics - Topics
Topic.create(	topic: "Market System",
				description: "The emphasis of this section is on government objectives and policies relating to economic growth, employment, stability of prices and the balance of payments. It emphasises the use of the AD-AS approach as a tool for the analysis of fiscal, monetary and supply-side policies, and their impact at the micro and macro levels.",
				subject_id: "2",
	)

Topic.create(	topic: "Market Failure and Government Intervention",
				description: "This theme examines the nature of market failure, its causes and possible policy remedies.",
				subject_id: "2",
	)

Topic.create(	topic: "National and International Economy",
				description: "This theme provides an introduction to the key indicators of economic performance, the basic AD/AS and AE-Income analysis, and the main objectives and instruments of government policy.",
				subject_id: "2",
	)

#Economics - Lessons
Lesson.create(	lesson: "Scarcity, Choice and Opportunity Cost",
				topic_id: "1",
	)

Lesson.create(	lesson: "Resource Allocation in Competitive Markets",
				topic_id: "1",
	)

Lesson.create(	lesson: "Price Discrimination",
				topic_id: "1",
				is_sublesson: true,
	)

Lesson.create(	lesson: "Firms and How They Operate",
				topic_id: "1",
	)

