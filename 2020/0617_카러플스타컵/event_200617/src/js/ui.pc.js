import ScrollActive from './lib/scroll-active';
import Parallax from './lib/parallax';
import { initLink } from './ui.common';

const initIntro = () => {
	const intro = document.querySelector('.intro');
	const screen = document.querySelector('#screen');
	
	screen.classList.add('fade');
	setTimeout(function(){
		intro.removeChild(screen);
	}, 600);

	setTimeout(function(){
		intro.classList.add('load');
	}, 500);
}

const eventActive = new ScrollActive('.content', {activeClass: 'active', distance: innerHeight * 0.5, invisible: true});
const topActive = new ScrollActive('.btn_top', {activePoint: [{from: 500}], activeClass: 'show'});

window.addEventListener('DOMContentLoaded', function() {
	initLink(600);
})

window.addEventListener('load', function(){
	initIntro();

	new Parallax([
		{element: '.line_wrap .w949', distance: 0.04},
		{element: '.line_wrap .w732', distance: 0.1},
		{element: '.line_wrap .w745', distance: 0.08},
		{element: '.line_wrap .w651', distance: 0.011},
		{element: '.line_wrap .w976', distance: 0.06},
		{element: '.line_wrap .w576', distance: 0.12}
	]);
})