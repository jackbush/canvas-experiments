var colours = require('./__colours.js');
var p5 = require('p5');

var containerId = 'jsSketchConstellations';

var sketch = function (p) {
	var numberOfPoints = 100;
	var pointDiameter = 4;
	var points = [];


	p.setup = function () {
		var linesCanvas = p.createCanvas(p.windowWidth, p.windowHeight);
		linesCanvas.parent(containerId);
		p.background(colours.prussian);
		p.stroke(255);
		p.fill(255);

		for(var i = 0; i < numberOfPoints; i++) {
			points.push(new Point());
		}
	};

	p.windowResized = function () {
		p.resizeCanvas(p.windowWidth, p.windowHeight);
		p.background(colours.prussian);
	};

	p.mousePressed = function () {};

	p.mouseReleased = function () {};

	p.draw = function () {
		points.forEach(function (point) {
			// point.update();
			point.display();
		})
	};

	function Point () {
		this.diameter = pointDiameter;
		this.startX = Math.random() * p.windowWidth;
		this.startY = Math.random() * p.windowHeight;
		this.position = p.createVector(this.startX, this.startY);
	};

	Point.prototype.update = function () {
		// move a bit
	};

	Point.prototype.display = function () {
		// console.log(this.position);
		p.ellipse(this.position.x, this.position.y, this.diameter, this.diameter);
	};
};

module.exports = {
	containerId: containerId,
	sketch: sketch
};
