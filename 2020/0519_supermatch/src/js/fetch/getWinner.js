// draw graph
const drawPercent = (per, win) => {
  const activeClass = 'active';
  const voteElement = document.querySelector('.vote_wrap');
  const graphElement = document.querySelectorAll('#graph span');
  const textNum = new Array(2).fill(-1);
  const count = [Math.ceil(per[0].value / per[1].value), 1];
  const isPerLoaded = voteElement.classList.contains(activeClass);
  Array.from(graphElement).forEach((v) => {
    v.style = '';
  });
  voteElement.classList.remove(activeClass);

  // draw graph
  const loop = () => {
    if (textNum[1] === per[1].value) {
      return;
    }
    if (win) {
      const rate1 = 'rate1';
      const rate1Element = Array.from(graphElement).find((v) => v.dataset.name === rate1);
      const movingPer = per.find((v) => v.name === rate1).value;
      Object.assign(rate1Element.style, { width: `${movingPer}%`, transition: 'width 300ms ease-out' });
    }
    per.forEach((v, i) => {
      if (textNum[i] > v.value) { return; }
      const state = document.querySelector(`#state [data-name=${v.name}]`);
      textNum[i] = textNum[i] + count[i] > v.value ? v.value : textNum[i] + count[i];
      state.innerText = textNum[i];
    });
    window.requestAnimationFrame(loop);
  };
  const activePer = () => {
    window.requestAnimationFrame(() => {
      voteElement.classList.add('active');
      loop();
    });
  };

  if (isPerLoaded) {
    activePer();
    return;
  }
  // add scroll event
  const scrollActive = () => {
    const stateElement = document.querySelector('#state');
    const offsetTop = stateElement.getBoundingClientRect().top - parseInt(window.innerHeight * 0.7, 10);
    if (offsetTop <= 0) {
      activePer();
      window.removeEventListener('scroll', scrollActive);
    }
  };

  window.addEventListener('scroll', scrollActive);
};

const setValue = (res) => {
  const stateElement = document.querySelector('#state');
  const grahElement = document.querySelector('#graph');

  const per = Object.keys(res).reduce((a, v) => {
    if (/rate\d/g.test(v)) {
      const name = v;
      const value = Math.round(res[v]);
      stateElement.querySelector(`[data-name=${name}]`).innerText = value;
      grahElement.querySelector(`[data-name=${name}]`).style = {
        width: `${value}%`,
        transition: 'width 0ms linear',
      };
      a.push({ name, value });
    }
    return a;
  }, []).sort((a, b) => b.value - a.value);

  const win = per.slice(1).find((v) => v.vaue === per[0].value) ? null : per[0];

  if (win) {
    const states = stateElement.querySelectorAll('.per span');
    Array.from(states).forEach((v) => {
      if (v.dataset.name === win.name) {
        const winner = v.closest('.vs');
        winner.classList.add('win');
        winner.classList.remove('loose');
      } else {
        const looser = v.closest('.vs');
        looser.classList.remove('win');
        looser.classList.add('loose');
      }
    });
  }

  drawPercent(per, win);
};

const getWinner = (done) => {
  // 더미데이터 받아오기
  fetch('http://rongchyo.cafe24.com/project/2020/supermatch/dummyData/getVote.json', {
    method: 'GET',
    mode: 'no-cors',
  })
    .then((res) => res.json())
    .then((res) => {
      setValue(res);
    })
    .catch((error) => {
      console.error(error);
    });
};

export default getWinner;
