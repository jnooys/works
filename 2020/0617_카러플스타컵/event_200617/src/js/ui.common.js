import jump from 'jump.js';
import { NavActive } from './lib/scroll-active';

const quickActive = new NavActive('.nav li', {distance: 60});

const initLNB = () => {
  const toggleButton = document.querySelector('.btn_toggle');
	toggleButton.addEventListener('click', function(){
		const lnb = document.querySelector('#lnb');
		lnb.classList.toggle('hide');
	})
}


export const initLink = (dur = 0, offset = 0) => {
  const linker = Array.from(document.querySelectorAll('a')).filter(v => /^#/.test(v.getAttribute('href')));
  let isMoving = false;
	linker.forEach(v => {
		v.addEventListener('click', function(e){
      e.preventDefault();
      if(isMoving) return;
      isMoving = true;
			const target = v.getAttribute('href') === '#top' ? 'body' : v.getAttribute('href') ;
			const duration = target === 'body' ? 0 : dur;
      jump(target, {duration, offset});

      setTimeout(function(){
        isMoving = false;
      }, Math.max(duration, 50));
		})
	})
}

const initLayer = () => {
  const openButton = document.querySelector('button[data-pop]');
  const closeButton = document.querySelector('.layerpop button');
  const html = document.querySelector('html');
  const body = document.querySelector('body');
  const isPC = body.classList.contains('pc');
  const fixed = document.querySelector('.nav');
  let isFade = false;
  let popupID;
  let popupElement;
  
  openButton.addEventListener('click', function() {
    if(isFade) return;
    isFade = true;
    popupID = this.getAttribute('data-pop');
    popupElement = document.querySelector(`#${popupID}`);
    popupElement.classList.add('show');
    if(isPC) {
      html.style.overflowY = 'hidden';
      body.style.overflowY = 'scroll';
      fixed.style.marginRight = `${document.body.offsetWidth - document.body.clientWidth}px`;
    }
    if(popupID === 'popVideo') {
      const url = this.getAttribute('data-url');
      const frame = popupElement.querySelector('.video_wrap');
      frame.innerHTML =`<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${url}?rel=0&showinfo=0&autoplay=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
    }
    setTimeout(function(){
      isFade = false;
      popupElement.classList.add('fadein');
    }, 16);
  });

  closeButton.addEventListener('click', function(){
    if(isFade) return;
    isFade = true;
    popupElement.classList.remove('fadein');
    if(popupID === 'popVideo') {
      const frame = popupElement.querySelector('.video_wrap');
      frame.removeChild(frame.childNodes[0]);
    }
    setTimeout(function(){
      isFade = false;
      if(isPC) {
        html.style.overflowY = '';
        body.style.overflowY = '';
        fixed.style.marginRight = '';
      }
      popupElement.classList.remove('show');
    }, 300);
  })
}

window.addEventListener('DOMContentLoaded', function(){
	initLNB();
  initLayer();
})