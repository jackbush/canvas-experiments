var colours = require('./_colours.js');
var io = require('socket.io-client');
var p5 = require('p5');

var containerId = 'linesSketchContainer';

var sketch = function (p) {
	var socket;
	var paths = [];
	var painting = false;
	var next = 0;
	var current;
	var previous;

	p.setup = function () {
		var linesCanvas = p.createCanvas(p.windowWidth, p.windowHeight);
		linesCanvas.parent(containerId);
		p.background(colours.prussian);
		current = p.createVector(0, 0);
		previous = p.createVector(0, 0);

		socket = io.connect('10.0.1.6:8080');

		socket.on('mouse', function (data) {
			next = 0;
			painting = true;
			previous.x = data.x;
			previous.y = data.y;
			paths.push(new Path());
		});
	};

	p.windowResized = function () {
		p.resizeCanvas(p.windowWidth, p.windowHeight);
		p.background(colours.prussian);
	};

	p.mousePressed = function () {
		var data = {
			x: p.mouseX,
			y: p.mouseY
		};
		socket.emit('mouse', data);
	};

	p.mouseReleased = function () {
		painting = false;
	};

	p.draw = function () {
		p.background(colours.prussian);

		if (p.millis() > next && painting) {
			current.x = p.mouseX;
			current.y = p.mouseY;

			// New particle's force is based on mouse movement
			var force = p5.Vector.sub(current, previous);
			force.mult(0.05);

			// Add new particle
			paths[paths.length - 1].add(current, force);

			// Schedule next circle
			next = p.millis() + p.random(100);

			// Store mouse values
			previous.x = current.x;
			previous.y = current.y;
		}

		// Draw all paths
		for (var i = 0; i < paths.length; i++) {
			paths[i].update();
			paths[i].display();
		}
	};

	// A Path is a list of particles
	function Path () {
		this.particles = [];
		this.hue = p.random(100);
	}

	Path.prototype.add = function (position, force) {
		// Add a new particle with a position, force, and hue
		this.particles.push(new Particle(position, force, this.hue));
	};

	// Display path
	Path.prototype.update = function () {
		for (var i = 0; i < this.particles.length; i++) {
			this.particles[i].update();
		}
	};

	// Display path
	Path.prototype.display = function () {
		// Loop through backwards
		for (var i = this.particles.length - 1; i >= 0; i--) {
			// If we shold remove it
			if (this.particles[i].lifespan <= 0) {
				this.particles.splice(i, 1);
				// Otherwise, display it
			} else {
				this.particles[i].display(this.particles[i + 1]);
			}
		}
	};

	// Particles along the path
	function Particle (position, force, hue) {
		this.position = p.createVector(position.x, position.y);
		this.velocity = p.createVector(force.x, force.y);
		this.drag = 0.95;
		this.lifespan = 255;
	}

	Particle.prototype.update = function () {
		// Move it
		this.position.add(this.velocity);
		// Slow it down
		this.velocity.mult(this.drag);
		// Fade it out
		this.lifespan--;
	};

	// Draw particle and connect it with a line
	// Draw a line to another
	Particle.prototype.display = function (other) {
		p.stroke(255, this.lifespan);
		p.fill(255, this.lifespan / 2);
		p.ellipse(this.position.x, this.position.y, 8, 8);
		// If we need to draw a line
		if (other) {
			p.line(this.position.x, this.position.y, other.position.x, other.position.y);
		}
	};
};

module.exports = {
	containerId: containerId,
	sketch: sketch
};
