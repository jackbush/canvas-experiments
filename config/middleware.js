var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

module.exports = function(app) {

	// app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')));

	app.use(logger('dev'));

	app.use(bodyParser.json());

	app.use(bodyParser.urlencoded({
		extended: false
	}));

	app.use(cookieParser());

	app.use(express.static(path.join(__dirname, '../public'), {
		// Set a random-ish expire time
		maxAge: ~~(Math.random() * 123456789) + 1000000
	}));

};