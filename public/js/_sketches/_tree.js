var colours = require('./_colours.js');

var containerId = 'treeSketchContainer';

var sketch = function (p5) {
	p5.setup = function () {
		var treeCanvas = p5.createCanvas(p5.windowWidth, p5.windowHeight);
		treeCanvas.parent(containerId);
		p5.background(colours.olive);
	};

	p5.draw = function () {
		p5.ellipse(80, 80, 50, 50);
	};
};

module.exports = {
	containerId: containerId,
	sketch: sketch
};
