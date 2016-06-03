// p5 loaded as a class
var P5 = require('p5');

// Require sketches
var tree = require('./_tree.js');

// Run sketches as new p5 instances
(function () {
	return new P5(tree.sketch, tree.containerId);
})();
