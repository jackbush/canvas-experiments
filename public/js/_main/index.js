require('./_nav.js');

setTimeout(function () {
	var elFullscreen = document.querySelectorAll('.js-fullscreen-canvas');
	var canvas = document.querySelector('canvas');
	console.log(canvas);

	elFullscreen.forEach(function (el) {
		el.addEventListener('click', function () {
			canvas.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
			// canvas.mozRequestFullScreen();
		});
	});
}, 1000);
