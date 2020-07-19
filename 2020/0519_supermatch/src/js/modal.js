import getWinner from './fetch/getWinner';

let fetchVote = null;

const modal = (() => {
  let html;
  let body;
  let isPC = false;
  let isOpening = false;
  let isClosing = false;
  let openedLength = 0;

  (() => {
    window.addEventListener('DOMContentLoaded', function () {
      html = document.querySelector('html');
      body = document.querySelector('body');
      isPC = body.classList.contains('pc');
    });
  })();

  const openCallback = (modalID, data) => {
    switch (modalID) {
      case 'popVideo': {
        const host = 'https://www.youtube.com/embed/';
        const param = '?rel=0&amp;showinfo=0&amp;autoplay=1';
        const { url } = data;
        const video = document.querySelector(`#${modalID} iframe`);
        video.setAttribute('src', `${host}${url}${param}`);
        break;
      }
      case 'popVote': {
        const { team } = data;
        const teamName = team === 1 ? 'TEAM 다오' : 'TEAM 배찌';
        const modalElement = document.querySelector(`#${modalID}`);
        const teamElement = document.querySelectorAll('.modalpop .team');
        const teamInput = modalElement.querySelector('input[name=teamnumber]');
        teamInput.value = team;
        Array.from(teamElement).forEach((v) => {
          v.innerHTML = teamName;
        });

        modalElement.classList.remove('team1', 'team2');
        modalElement.classList.add(`team${team}`);
        break;
      }
      default:
        break;
    }
  };

  const closeCallback = (modalID) => {
    const modalElement = document.querySelector(`#${modalID}`);

    if (modalID === 'popAlert') {
      const textElement = modalElement.querySelector('.alert_wrap');
      textElement.innerHTML = '';
      if (fetchVote) {
        getWinner();
        fetchVote = null;
      }
      return;
    }
    if (modalElement.classList.contains('pop_register')) {
      const input = modalElement.querySelector('input[name=userid]');
      const checkbox = modalElement.querySelectorAll('input[name=agree]');
      const changeEvent = new Event('change', { bubbles: true, cancelable: true });
      Array.from(checkbox).forEach((v) => {
        v.checked = false;
        v.dispatchEvent(changeEvent);
      });
      input.classList.remove('focus');
      input.value = '';
    }
  };

  const open = (id, data) => {
    if (isOpening === id) return;
    const modalElement = document.querySelector(`#${id}`);
    openCallback(id, data);
    modalElement.classList.add('show');
    if (!openedLength) {
      html.style.overflowY = 'hidden';
      body.style.overflowY = 'scroll';
      if (isPC) {
        const fixedElement = document.querySelectorAll('.fixright');
        Array.from(fixedElement).forEach((v) => {
          v.style.marginRight = `${document.body.offsetWidth - document.body.clientWidth}px`;
        });
      }
    }
    openedLength++;
    setTimeout(() => {
      modalElement.classList.add('fadein');
      setTimeout(() => {
        isOpening = false;
      });
    }, 16);
  };

  const close = (id) => {
    if (isClosing === id) return;
    isClosing = id;
    const modalElement = document.querySelector(`#${id}`);
    modalElement.classList.remove('fadein');
    openedLength--;
    setTimeout(() => {
      isClosing = false;
      if (!openedLength) {
        html.style.overflowY = '';
        body.style.overflowY = '';
        if (isPC) {
          const fixedElement = document.querySelectorAll('.fixright');
          Array.from(fixedElement).forEach((v) => {
            v.style.marginRight = '';
          });
        }
      }
      modalElement.classList.remove('show');
      closeCallback(id);
    }, 300);
  };

  return { open, close };
})();

export const modalAlert = (text, refresh) => {
  const id = 'popAlert';
  const element = document.querySelector(`#${id}`);
  const message = element.querySelector('.alert_wrap');
  message.innerHTML = text;
  if (refresh) {
    fetchVote = refresh;
  }
  modal.open(id);
};

export default modal;
