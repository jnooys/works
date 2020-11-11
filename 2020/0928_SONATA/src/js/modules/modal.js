// modal
export default class Modal {
  constructor() {
    this.isOpening = false;
    this.isClosing = false;
    this.openedLength = 0;
    this.focusing = null;

    window.addEventListener('DOMContentLoaded', () => {
      this.init();
    });
  }

  init() {
    this.html = document.querySelector('html');
    this.body = document.querySelector('body');
    this.fixedElement = Array.from(document.querySelectorAll('.fixright'));
    this.addClickEvent();
  }

  addClickEvent() {
    openEvent(this.open.bind(this));
    closeEvent(this.close.bind(this));

    function openEvent(open) {
      const buttonOpen = Array.from(
        document.querySelectorAll('button[data-modal]'),
      );
      buttonOpen.forEach((v) => {
        v.addEventListener('click', function () {
          const id = v.dataset.modal;
          open(id);
        });
      });
    }

    function closeEvent(close) {
      const buttonClose = Array.from(
        document.querySelectorAll('.modal .btn_close'),
      );
      buttonClose.forEach((v) => {
        v.addEventListener('click', function () {
          const id = v.closest('.modal').id;
          close(id);
        });
      });
    }
  }

  open(id, callback) {
    if (this.isOpening === id) return;
    const modalElement = document.querySelector(`#${id}`);
    modalElement.classList.add('show');
    if (!this.openedLength) {
      this.html.style.overflowY = 'hidden';
      this.body.style.overflowY = 'scroll';
      this.fixedElement.forEach((v) => {
        v.style.marginRight = `${
          document.body.offsetWidth - document.body.clientWidth
        }px`;
      });
    }
    this.openedLength++;
    typeof callback === 'function' && callback(id);
    setTimeout(() => {
      modalElement.classList.add('fadein');
      setTimeout(() => {
        this.isOpening = false;
      });
    }, 16);
  }

  close(id, callback) {
    if (this.isClosing === id) return;
    this.isClosing = id;
    const modalElement = document.querySelector(`#${id}`);
    modalElement.classList.remove('fadein');
    this.openedLength--;
    setTimeout(() => {
      this.isClosing = false;
      if (!this.openedLength) {
        this.html.style.overflowY = '';
        this.body.style.overflowY = '';
        this.fixedElement.forEach((v) => {
          v.style.marginRight = '';
        });
      }
      modalElement.classList.remove('show');
      typeof callback === 'function' && callback(id);
    }, 200);
  }

  alert(text, input, id = 'modalAlert') {
    const element = document.querySelector(`#${id}`);
    const message = element.querySelector('.alert_wrap');
    message.innerHTML = !/^</.test(text) ? `<p>${text}</p>` : text;
    if (input) {
      this.focusing = input;
    }
    this.open(id);
  }
}
