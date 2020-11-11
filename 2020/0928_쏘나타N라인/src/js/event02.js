import ActiveNav from './modules/activeNav';
import LNB from './modules/lnb';
import initMotion from './modules/initMotion';
import isIE from './modules/isIE';
import setVideoRatio from './modules/setVideoRatio';
import scrollToAnchor from './modules/scrollToAnchor';

// top button
const topButton = (() => {
  let button;

  function init() {
    button = document.querySelector('aside .btn_top');
    button.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo(0, 0);
    });
  }

  function scroll(pageYOffset) {
    if (!button) return;
    const basis = parseInt(innerHeight * 0.5);
    if (pageYOffset > basis && !button.classList.contains('active')) {
      button.classList.add('active');
    } else if (pageYOffset <= basis && button.classList.contains('active')) {
      button.classList.remove('active');
    }
  }

  return { init, scroll };
})();

new ActiveNav('aside .depth1', {
  className: 'active',
  distance: 100,
  reverse: true,
});
new ActiveNav('aside .depth2', {
  className: 'active',
  distance: 100,
  reverse: true,
});

window.addEventListener('DOMContentLoaded', function () {
  initMotion('event02_06A2', ['h2.png', 'bg_intro.jpg']);
  setVideoRatio();
  scrollToAnchor();
  isIE();
  new LNB();
  topButton.init();
});

window.addEventListener('scroll', function () {
  const { pageYOffset } = window;
  topButton.scroll(pageYOffset);
});

window.addEventListener('resize', function () {
  setVideoRatio();
});
