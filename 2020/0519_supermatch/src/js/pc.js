import { customSwiper, jumpToTarget } from './common';
import ScrollActive, { NavActive } from './lib/scroll-active';

// load main
const loadMain = () => {
  const intro = document.querySelector('#intro');
  const imageDomain = 'https://nxm-mt.akamaized.net/Contents/kartrush.nexon.com/launching/images_9B452F71D3CCA09B/pc/';
  const imagePath = ['bg_main_v2.jpg', 'spr_char_main.png'];
  const imagePromise = imagePath.map((v) => new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      resolve(true);
    };
    image.onerror = () => {
      reject();
    };
    image.src = `${imageDomain}${v}`;
  }));
  Promise.all(imagePromise).then(() => {
    intro.classList.add('load');
  }).catch(() => {
    setTimeout(() => {
      intro.classList.add('load');
    }, 500);
  });
};

// util buttons toggle
const toggleShareButton = () => {
  const shareButton = document.querySelector('.share_btn');
  shareButton.addEventListener('mouseover', function () {
    this.classList.add('open');
  });

  shareButton.addEventListener('mouseout', function () {
    this.classList.remove('open');
  });
};

// superMatch section responsive height
const setSupermatchScale = () => {
  const supermatch = document.querySelector('.scale_wrap');
  const { innerHeight } = window;
  const basis = 1177;
  const height = innerHeight > basis ? basis : innerHeight < 950 ? 950 : innerHeight;
  const ratio = Math.min(1, Math.round(height / basis * 100) / 100);
  supermatch.style.transform = `scale(${ratio})`;
};

// quick banner active point
const quickscroll = (() => {
  let floating = [];
  let floatingList = [];

  const getPoint = () => {
    floatingList = Array.from(floating).map((v) => {
      const { pageYOffset } = window;
      const headerHeight = 60;
      const parentOffset = v.parentElement.getBoundingClientRect();
      const targetTop = parseInt(v.dataset.top, 10) * 2;
      const targetOffset = targetTop + v.getBoundingClientRect().height;
      return { target: v, from: Math.max(pageYOffset + parentOffset.top - headerHeight, 0), to: pageYOffset + parentOffset.bottom - targetOffset + headerHeight };
    });
  };

  const scroll = () => {
    const { pageYOffset } = window;
    floatingList.forEach((v) => {
      if (v.to <= pageYOffset) {
        v.target.classList.remove('scrolling');
        v.target.classList.add('scrollend');
      } else if (v.from <= pageYOffset) {
        v.target.classList.add('scrolling');
        v.target.classList.remove('scrollend');
      } else {
        v.target.classList.remove('scrolling', 'scrollend');
      }
    });
  };

  const init = () => {
    floating = document.querySelectorAll('.floating');
    getPoint();
  };

  return { init, scroll, getPoint };
})();

// parallax
const eventActive = new ScrollActive('.parallax', { activeClass: 'active', distance() { return window.innerHeight * 0.5; }, invisible: true });

// quick menu active
const matchQuickNav = new NavActive('#matchQuick li a', { activeClass: 'on' });

window.addEventListener('DOMContentLoaded', function () {
  loadMain();
  toggleShareButton();
  setSupermatchScale();
  jumpToTarget(600);
  customSwiper({
    loopedSlides: 2,
  });
});

window.addEventListener('load', function () {
  quickscroll.init();
});

window.addEventListener('scroll', function () {
  quickscroll.scroll();
});

window.addEventListener('resize', function () {
  quickscroll.getPoint();
  setSupermatchScale();
});
