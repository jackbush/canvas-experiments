var colours = require('./__colours.js');
// var p5 = require('p5');

var containerId = 'jsSketchConstellations';

var sketch = function (p) {
	var numberOfPoints = 120;
	var maxDiameter = 10;
	var minDiameter = 4;
	var strokeWeight = 2;
	var maxLength = 100;
	var points = [];
	var lines;
	var frame = 0;

	p.setup = function () {
		var linesCanvas = p.createCanvas(p.windowWidth, p.windowHeight);
		linesCanvas.parent(containerId);
		p.background(colours.prussian);

		for (var i = 0; i < numberOfPoints; i++) {
			points.push(new Point());
		}
	};

	p.windowResized = function () {
		p.resizeCanvas(p.windowWidth, p.windowHeight);
		p.background(colours.prussian);
	};

	p.draw = function () {
		frame += 0.001;
		p.background(colours.prussian);

		lines = [];

		points.forEach(function (point, index) {
			point.update();
			for (var i = index + 1; i < points.length; i++) {
				if (point.position &&
					points[i].position &&
					point.position.dist(points[i].position) < maxLength
				) {
					lines.push(new Line(point, points[i]));
				}
			}
			point.display();
		});
	};

	function Point () {
		this.diameter = Math.random() * (maxDiameter - minDiameter) + minDiameter;
		this.startX = Math.random() * p.windowWidth;
		this.startY = Math.random() * p.windowHeight;
		this.range = 2 * Math.random() - 0.5;
	}

	Point.prototype.update = function () {
		var deltaX = 100 / this.range * Math.sin(frame);
		var deltaY = 100 / this.range * Math.cos(frame);
		this.position = p.createVector(this.startX + deltaX, this.startY + deltaY);
	};

	Point.prototype.display = function () {
		p.noStroke();
		p.fill(200);
		p.ellipse(this.position.x, this.position.y, this.diameter, this.diameter);
	};

	function Line (pointA, pointB) {
		p.strokeWeight(strokeWeight);
		p.stroke(250, 250, 250, maxLength - pointA.position.dist(pointB.position));
		p.line(pointA.position.x, pointA.position.y, pointB.position.x, pointB.position.y);
	}
};

module.exports = {
	containerId: containerId,
	sketch: sketch
};
