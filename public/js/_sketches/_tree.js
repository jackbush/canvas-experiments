var colours = require('./_colours.js');
var io = require('socket.io-client');

var containerId = 'treeSketchContainer';

var sketch = function (p5) {
	var socket;
	p5.setup = function () {
		var treeCanvas = p5.createCanvas(p5.windowWidth, p5.windowHeight);
		treeCanvas.parent(containerId);
		p5.background(colours.prussian);

		socket = io.connect('http://localhost:8080') || io.connect('https://aqueous-everglades-22305.herokuapp.com/:8080');
		socket.on('mouse', function (data) {
			p5.noStroke();
			p5.ellipse(data.x, data.y, 10, 10);
		});
	};

	p5.windowResized = function () {
		p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
		p5.background(colours.prussian);
	};

	p5.mouseDragged = function () {
		var data = {
			x: p5.mouseX,
			y: p5.mouseY
		};
		socket.emit('mouse', data);
		p5.fill(255);
		p5.noStroke();
		p5.ellipse(p5.mouseX, p5.mouseY, 10, 10);
	};
};

module.exports = {
	containerId: containerId,
	sketch: sketch
};
