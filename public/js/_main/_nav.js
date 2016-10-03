var openMenu = document.querySelector('.js-open-menu');
var closeMenu = document.querySelector('.js-close-menu');
var menu = document.querySelector('.js-menu');

openMenu.addEventListener('click', function () {
	menu.classList.add('open');
});

closeMenu.addEventListener('click', function () {
	menu.classList.remove('open');
});
