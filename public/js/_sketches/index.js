// p5 loaded as a class
var P5 = require('p5');

// Require sketches
var lines = require('./_lines.js');

// Run sketches as new p5 instances
(function () {
	return new P5(lines.sketch, lines.containerId);
})();
