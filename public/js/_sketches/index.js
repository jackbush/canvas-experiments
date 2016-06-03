var P5 = require('p5');

var tree = require('./_tree.js');

(function () {
	return new P5(tree.sketch, tree.containerId);
})();
