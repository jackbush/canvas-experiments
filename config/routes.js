var path = require('path');
var fs = require('fs');

module.exports = function (app) {
	// Find controller filenames
	var controllerNames = fs.readdirSync(path.resolve(__dirname + './../controllers'));

	// Trim extensions from filenames
	for (var i = 0; i < controllerNames.length; i++) {
		controllerNames[i] = controllerNames[i].slice(0, -3);
	}

	// Load controllers
	var controllers = {};
	controllerNames.forEach(function (name) {
		controllers[name] = require('../controllers/' + name);
	});

	app.get('/', function (req, res) {
		res.render('index');
	});
};
