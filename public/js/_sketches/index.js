// p5 loaded as a class
var P5 = require('p5');

// Require sketches
var drawings = [
	require('./_lines.js'),
	require('./_constellations.js'),
	require('./_blob.js')
];

// Render if the containerId is present
for (var i = 0; i < drawings.length; i++) {
	if (document.getElementById(drawings[i].containerId)) {
		(function () {
			return new P5(drawings[i].sketch, drawings[i].containerId);
		})();
	}
}
