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
// require('./config/db.js')();

// Middleware
require('./config/middleware.js')(app);

// Load controllers and attach them to routes
require('./config/routes.js')(app);

// Error handler
require('./config/errorHandler.js')(app);

// Socket!

var server = app.listen(8080);
var io = require('socket.io').listen(server);

io.sockets.on('connection',
	function (socket) {
		console.log('connected to: ' + socket.id);
		socket.on('mouse', function (data) {
			// socket.broadcast.emit('mouse', data);
			io.sockets.emit('mouse', data);
		});
	}
);

module.exports = app;
