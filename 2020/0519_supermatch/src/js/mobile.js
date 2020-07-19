import { customSwiper, jumpToTarget } from './common';

const toggleGNB = () => {
  const toggleButton = document.querySelector('#btn_toggle');
  const nav = document.querySelectorAll('nav a');
  const wrap = document.querySelector('#wrap');
  toggleButton.addEventListener('click', function () {
    wrap.classList.toggle('gnb_show');
  });

  Array.from(nav).forEach((v) => {
    v.addEventListener('click', function () {
      wrap.classList.remove('gnb_show');
    });
  });
};

window.addEventListener('DOMContentLoaded', function () {
  toggleGNB();
  jumpToTarget();
  customSwiper({
    pagination: {
      el: '.slide_nav',
      clickable: true,
    },
  });
});
