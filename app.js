// Simulate config options from other environments by
// customising the .env file in your project's root folder.
require('dotenv').load();

var express = require('express');
var path = require('path');
var app = express();

// Configure view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Load models and connect to database
require('./config/db.js')();

// Middleware
require('./config/middleware.js')(app);

// Load controllers and attach them to routes
require('./config/routes.js')(app);

// Error handler
require('./config/errorHandler.js')(app);

module.exports = app;
