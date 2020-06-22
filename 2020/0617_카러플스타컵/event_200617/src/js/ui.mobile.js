import { initLink } from './ui.common';
import ScrollActive from './lib/scroll-active';

const navActive = new ScrollActive('.nav', {activePoint: {from: 50}, activeClass: 'show'});

window.addEventListener('DOMContentLoaded', function() {
	initLink(0, -50);
})