import Swiper, { Navigation, Pagination } from 'swiper';
import * as Clipboard from 'clipboard';
import jump from 'jump.js';
import { NavActive } from './lib/scroll-active';
import modal from './modal';
import addEventRegister from './fetch/postRegister';
import getWinner from './fetch/getWinner';

Swiper.use([Navigation, Pagination]);

// copy url
const copyURL = () => {
  const clipboard = new Clipboard('.btn_copy');
  clipboard.on('success', () => {
    window.alert('URL주소가 복사되었습니다. \n공유할 곳에 붙여넣기해주세요.');
  });
};

// share facebook & twitter
const shareSNS = () => {
  const share = {
    title: '카트라이더 러쉬플러스 이제 모바일에서도 카트하자!',
    twitter() {
      const shareURL = 'https://app.adjust.com/7j3bryx';
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(this.title)}&url=${encodeURIComponent(shareURL)}`, '', 'width=680, height=500');
    },
    facebook() {
      const shareURL = 'https://kartrush.nexon.com/kr-launching?spot=1';
      window.FB.ui({
        method: 'share',
        href: shareURL,
      }, () => {
      });
    },
  };
  const shareButton = document.querySelectorAll('button[data-share]');
  Array.prototype.forEach.call(shareButton, (v) => {
    const type = v.dataset.share;
    v.addEventListener('click', share[type]);
  });
};

/* custom checkbox */
const customCheckbox = () => {
  const checkboxAll = document.querySelectorAll('.checkbox input');

  const changeHandler = (checkbox) => () => {
    const checkedClass = 'checked';
    const allClass = 'agreeAll';
    const check = checkbox.checked;
    const name = checkbox.getAttribute('name');
    const checkboxes = Array.from(checkbox.closest('form').querySelectorAll(`[name=${name}]`));
    const allCheckbox = checkboxes.find((v) => v.classList.contains(allClass));
    const siblings = checkboxes.filter((v) => !v.classList.contains(allClass));

    if (check) {
      checkbox.parentNode.classList.add(checkedClass);
    } else {
      checkbox.parentNode.classList.remove(checkedClass);
    }

    if (checkbox.classList.contains(allClass)) {
      siblings.forEach((v) => {
        if (check) {
          v.checked = true;
          v.parentNode.classList.add(checkedClass);
        } else {
          v.checked = false;
          v.parentNode.classList.remove(checkedClass);
        }
      });
    } else {
      const allChecked = siblings.every((v) => v.checked);
      if (allChecked) {
        allCheckbox.checked = true;
        allCheckbox.parentNode.classList.add(checkedClass);
      } else {
        allCheckbox.checked = false;
        allCheckbox.parentNode.classList.remove(checkedClass);
      }
    }
  };

  Array.from(checkboxAll).forEach((v) => {
    v.addEventListener('change', changeHandler(v));
  });
};

const addEventInput = () => {
  const userValue = document.querySelectorAll('input[type=tel]');
  const onBlur = (element) => () => {
    if (element.value.length) {
      element.classList.add('focus');
    } else {
      element.classList.remove('focus');
    }
  };
  const onChange = (element) => () => {
    element.value = element.value.replace(/[^0-9]/g, '');
  };

  Array.from(userValue).forEach((e) => {
    e.addEventListener('blur', onBlur(e));
    e.addEventListener('keyup', onChange(e));
  });
};

/* modal button */
const addEventModal = () => {
  const openButton = document.querySelectorAll('button[data-pop]');
  const closeButton = document.querySelectorAll('.btn_close');

  Array.from(openButton).forEach((v) => {
    v.addEventListener('click', function () {
      const id = this.dataset.pop;
      modal.open(id, this.dataset);
    });
  });
  Array.from(closeButton).forEach((v) => {
    v.addEventListener('click', function () {
      const id = this.closest('.modalpop').getAttribute('id');
      modal.close(id);
    });
  });
};

// scroll To anchor
export const jumpToTarget = (duration = 0) => {
  const jumpButton = Array.from(document.querySelectorAll('a')).filter((v) => /^#/.test(v.getAttribute('href')));
  jumpButton.forEach((v) => {
    let isMoving = false;
    v.addEventListener('click', function (e) {
      if (isMoving) return;
      e.preventDefault();
      isMoving = true;
      jump(v.getAttribute('href'), {
        duration,
      });
      setTimeout(() => {
        isMoving = false;
      }, duration);
    });
  });
};

// swpier slider
export const customSwiper = (userOptions) => {
  const defaultOptions = {
    allowTouchMove: true,
    speed: 500,
    loop: true,
    navigation: {
      nextEl: '.btn_next',
      prevEl: '.btn_prev',
    },
  };
  const swiper = new Swiper('.slide_container', Object.assign(defaultOptions, userOptions));
};

// navigation menu active
const navActive = new NavActive('nav li a', { distance: 60 });

window.addEventListener('DOMContentLoaded', function () {
  copyURL();
  shareSNS();
  customCheckbox();
  addEventModal();
  addEventRegister();
  addEventInput();
  getWinner();
});

window.fbAsyncInit = function () {
  window.FB.init({
    appId: '594554644590734',
    xfbml: true,
    version: 'v6.0',
  });
};

export default null;
