# Installing

Fork then clone this repository down locally:

	git clone git@github.com:YOUR_USERNAME/journey-groups.git

Make sure you have installed NodeJS:

	http://nodejs.org/download/

Install its dependencies:

	npm install
	bower install

Copy the configuration JSON file, and update it with your CCB credentials:

	cp server/config.sample.json server/config.json
	open server/config.json

# Running

	node app.js

# Deploying

Learn about setting up Heroku:

	https://devcenter.heroku.com/articles/getting-started-with-nodejs

Then:

	heroku login
	heroku create
	git push heroku master
