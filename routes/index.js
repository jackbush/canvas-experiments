var path = require('path');
var fs = require('fs');

module.exports = function (app) {
	// Find controller filenames
	var controllerNames = fs.readdirSync(path.resolve(__dirname, './../controllers'));

	// Trim extensions from filenames
	for (var i = 0; i < controllerNames.length; i++) {
		controllerNames[i] = controllerNames[i].slice(0, -3);
	}

	// Load controllers
	var controllers = {};
	controllerNames.forEach(function (name) {
		controllers[name] = require('../controllers/' + name);
	});

	// Home
	app.get('/', controllers.index);

	// Experiments
	app.get('/lines/', function (req, res) {
		res.render('lines-sketch');
	});

	app.get('/constellations/', function (req, res) {
		res.render('constellations');
	});

	// Journeys
	app.get('/cosmic-sea/', controllers.cosmicSea);
	app.get('/iceland/', controllers.iceland);

	// CV
	app.get('/cv/', function (req, res) {
		res.render('cv');
	});
};
