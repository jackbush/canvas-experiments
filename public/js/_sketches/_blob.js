var colours = require('./__colours.js');
var containerId = 'jsSketchBlob';

function measureContainer (container) {
	var el = document.getElementById(container);
	var size = {};
	size.width = el.clientWidth;
	size.height = el.clientHeight;

	return size;
}

// This is used to give numbers a variance, defaulting to 10%
function jitter (number, factor) {
	factor = factor || 0.1;
	var range = number * factor * Math.random() * 2;
	var variance = range - range / 2;
	return number + variance;
}

var sketch = function (p) {
	var container;
	var canvas;
	var brandDevice;
	var config = {
		frameRate: 60,
		layers: 5,
		// float: 0 = transparent, 1 = opaque
		opacity: 0.15,
		// Decimal value between 0 and 1
		// NOTE other stuff breaks when this isn't 0.1
		spread: 0.1,
		// Arbitrary constants...
		speed: 20,
		acceleration: 100,

		blobColour: colours.lightblue,
		backgroundColour: colours.background
	};

	// Convert opacity to the scale p5 expects...
	config.opacity *= 255;
	// Convert speed to be independent of framerate (defaults to 60)
	config.speed /= config.frameRate;
	// Correct speed for how we actually use it -- otherwise things get really counterintuitive
	config.speed *= -1;

	p.setup = function () {
		// Set framerate
		p.frameRate(config.frameRate);

		// Get container details
		container = measureContainer(containerId);

		// Create a canvas from container size
		canvas = p.createCanvas(container.width, container.height);

		// Attach canvas to container
		canvas.parent(containerId);

		// Get position for brand device, create and add blobs
		var position = p.createVector(container.width * 0.5, container.height * 0.5);
		brandDevice = new Cluster(position);
		brandDevice.add(config.layers);

		// If it's not been done, change generic colour to the p5 format with opapcity
		if (config.blobColour === colours.lightblue) {
			config.blobColour = p.color(
				config.blobColour.r,
				config.blobColour.g,
				config.blobColour.b,
				config.opacity
			);
		}

		// Set p5's fill and stroke here, as they don't change
		p.fill(config.blobColour);
		p.noStroke();
	};

	// Set to re-start on window resize
	p.windowResized = p.setup;

	p.draw = function () {
		p.background(config.backgroundColour.hex);
		brandDevice.update();
		brandDevice.display();
	};

	// A Cluster is a collection of Blobs, which share a center.
	function Cluster (position) {
		this.blobs = [];
		this.center = p.createVector(position.x, position.y);
	}

	Cluster.prototype.add = function (numberOfLayers) {
		numberOfLayers = numberOfLayers || 1;
		for (var i = 0; i < numberOfLayers; i++) {
			this.blobs.push(new Blob(this.center));
		}
	};

	Cluster.prototype.update = function () {
		this.blobs.forEach(function (blob) {
			blob.update();
		});
	};

	Cluster.prototype.display = function () {
		this.blobs.forEach(function (blob) {
			blob.display();
		});
	};

	// A Blob is an irregular, undulating shape
	function Blob (position) {
		this.position = p.createVector(position.x, position.y);

		// Hard-coded because the coordinate system only works for five!
		this.points = [
			new Point(0),
			new Point(1),
			new Point(2),
			new Point(3),
			new Point(4)
		];

		// This is the order we must draw points to create the blob:
		// [0, 3, 1, 4, 2]

		// This loops around three points further at each end, for a smooth join
		this.drawCycle = [1, 4, 2, 0, 3, 1, 4, 2, 0, 3, 1];
	}

	Blob.prototype.update = function () {
		this.points.forEach(function (point) {
			point.update();
		});
	};

	Blob.prototype.display = function () {
		p.beginShape();

		var that = this;
		this.drawCycle.forEach(function (n) {
			p.curveVertex(
				that.position.x + that.points[n].position.x,
				that.position.y + that.points[n].position.y
			);
		});

		p.endShape(p.CLOSE);
	};

	function Point (vertex) {
		// Vertex is an index, going clockwise from 12 o'clock
		// This is used by the getCoordinates function
		this.vertex = vertex;

		this.radius = jitter(container.height * 0.35, 0.25);
		this.initialRadius = this.radius;
		this.minRadius = this.radius * (1 - config.spread);
		this.maxRadius = this.radius * (1 + config.spread);

		// Which direction the point starts moving in
		this.isGrowing = Math.random() < 0.5;

		// Points are created with a position for flexibility
		this.position = this.getCoordinates(this.vertex, this.radius);
	}

	Point.prototype.update = function () {
		// Change directions if radius is out of bounds
		// The adjustment of min and max here is because otherwise we get stuck in limits!
		if (this.radius >= (this.maxRadius * 0.99)) this.isGrowing = false;
		if (this.radius <= (this.minRadius * 1.01)) this.isGrowing = true;

		// position is the point's position between min (-spread) and max (spread);
		var position = this.radius / this.initialRadius - 1;
		// delta is the difference between the current radius and the next one
		var delta = (config.acceleration * config.speed * Math.pow(position, 2)) - config.speed;

		// Correct radius change for direction
		if (!this.isGrowing) delta *= -1;

		// Update radius and position
		this.radius += delta;
		this.position = this.getCoordinates(this.vertex, this.radius);
	};

	Point.prototype.getCoordinates = function (vertex, radius) {
		var result = {
			x: 0.0,
			y: 0.0
		};

		// This is sepecifically for a five-point blob
		// This only has three options because symmetry
		switch (vertex) {
		case 0:
			result.x = 0;
			result.y = -1 * radius;
			break;
		case 1:
		case 4:
			result.x = radius * p.cos(18);
			result.y = -1 * radius * p.sin(18);
			break;
		case 2:
		case 3:
			result.x = radius * p.cos(54);
			result.y = radius * p.sin(54);
			break;
		}

		// Mirrors for left-side points
		if (vertex === 3 || vertex === 4) result.x *= -1;

		return result;
	};
};

module.exports = {
	containerId: containerId,
	sketch: sketch
};
