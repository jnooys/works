import ActiveElement from './modules/activeElement';
import ActiveNav from './modules/activeNav';
import LNB from './modules/lnb';
import Modal from './modules/modal';
import initMotion from './modules/initMotion';
import isIE from './modules/isIE';
import scrollToAnchor from './modules/scrollToAnchor';
import setVideoRatio from './modules/setVideoRatio';

const modal = new Modal();

function setVideoModal() {

  const id = 'modalVideo';
  const modalElement = document.getElementById(id);
  const iframe = modalElement.querySelector('iframe');

  addEvent();

  function openCallback() {
    iframe.src = 'https://www.youtube.com/embed/rv_1xRFvsEQ?rel=0&showinfo=0&autoplay=1';
  }

  function closeCallback() {
    iframe.src = '';
  }

  function addEvent() {
    const openButton = document.querySelector('.video_wrap button');
    openButton.addEventListener('click', function() {
      modal.open(id, openCallback);
    });

    const closeButton = modalElement.querySelector('.btn_x');
    closeButton.addEventListener('click', function() {
      modal.close(id, closeCallback);
    });
  }
}

new ActiveElement('.parallax', {
  className: 'active',
  distance() {
    return Math.floor(window.innerHeight * 0.6);
  },
  hide: true,
});

new ActiveNav('#nav .linker', {
  className: 'on',
  distance: 100,
  reverse: true,
});

window.addEventListener('DOMContentLoaded', function () {
  initMotion('event01_875A', ['bg_dao_shape.png', 'bg_dao_body.png', 'bg_intro.jpg', 'bg_bottom.png',]);
  setVideoRatio();
  setVideoModal();
  scrollToAnchor();
  isIE();
  new LNB();
});

window.addEventListener('resize', function () {
  setVideoRatio();
});