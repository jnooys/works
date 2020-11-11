import OverlayScrollbars from 'overlayscrollbars';
import 'overlayscrollbars/css/OverlayScrollbars.min.css';

export default class LNB {

  constructor () {
    this.className = 'hide';
    this.breakPoint = 1024;
    this.isClickToggle = false;

    this.init();

    window.addEventListener('resize', () => {
      this.resize();
    })
  }

  init () {
    this.element = document.getElementById('lnb');
    this.resize();
    this.toggle();

    OverlayScrollbars(document.querySelector('.lnb_scroll'), {
      className: 'os-theme-light',
    });
  }

  resize () {
    if (this.isClickToggle) return;

    if (window.innerWidth <= this.breakPoint) {
      this.element.classList.add(this.className);
    } else {
      this.element.classList.remove(this.className);
    }
  };

  toggle () {
    const button = this.element.querySelector('.btn_toggle');
    button.addEventListener('click', () => {
      this.element.classList.toggle(this.className);
      if (!this.isClickToggle) {
        this.isClickToggle = true;
      }
    });
  };
};