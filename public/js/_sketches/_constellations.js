var colours = require('./__colours.js');
// var p5 = require('p5');

var containerId = 'jsSketchConstellations';

var sketch = function (p) {
	var numberOfPoints = 120;
	var maxDiameter = 20;
	var minDiameter = 6;
	var maxLength = 100;
	var strokeWidth = 2;
	var points = [];
	// var fakeStars = 50;
	// var auxStars = [];
	var lines;
	var frame = 0;

	p.setup = function () {
		var linesCanvas = p.createCanvas(p.windowWidth, p.windowHeight);
		linesCanvas.parent(containerId);
		p.background(colours.grey3);

		for (var i = 0; i < numberOfPoints; i++) {
			points.push(new Point());
		}

		// for (var i = 0; i < fakeStars; i++) {
		// 	auxStars.push(new Point());
		// }
	};

	p.windowResized = function () {
		p.resizeCanvas(p.windowWidth, p.windowHeight);
		p.background(colours.grey3);
	};

	p.draw = function () {
		frame += 0.001;
		p.background(colours.grey3);

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

		// auxStars.forEach(function (point) {
		// 	point.update();
		// 	point.display();
		// });
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
		p.fill(colours.prussian);
		p.ellipse(this.position.x, this.position.y, this.diameter, this.diameter);
	};

	function Line (pointA, pointB) {
		p.strokeWeight(strokeWidth);
		// i think this is the rgb for prussian
		p.stroke(28, 34, 66, maxLength - pointA.position.dist(pointB.position));
		p.line(pointA.position.x, pointA.position.y, pointB.position.x, pointB.position.y);
	}
};

module.exports = {
	containerId: containerId,
	sketch: sketch
};
