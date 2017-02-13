// Stop Happiness from complaining about use of Element
/* global Element */

var elFullscreenTrigger = document.querySelector('.js-fullscreen-canvas');

function fullScreenCanvas () {
	var elCanvas = document.querySelector('canvas');
	elCanvas.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);

	// Because firefox.
	if (typeof InstallTrigger !== 'undefined') elCanvas.mozRequestFullScreen();
}

elFullscreenTrigger.addEventListener('click', fullScreenCanvas);
