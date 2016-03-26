var mongoose = require('mongoose');
var path = require('path');
var fs = require('fs');

module.exports = function() {

	// Find model filenames
	var modelNames = fs.readdirSync(path.resolve(__dirname + './../models'));

	// Trim extensions from filenames
	for (var i = 0; i < modelNames.length; i++) {
		modelNames[i] = modelNames[i].slice(0, -3);
	}

	// Register models
	modelNames.forEach(function(name) {
	    mongoose.model(name, require('../models/' + name));
	});

	// Connect to database
	var localDatabase = 'mongodb://localhost/tree-drawing-bmi';
	var uriString = process.env.MONGOLAB_URI || localDatabase;

	mongoose.connect(uriString, function(err, res) {
		if (err) {
			console.log('ERROR connecting to: ' + uriString + '. ' + err);
		} else {
			console.log('Connected to: ' + uriString);
		}
	});
};
