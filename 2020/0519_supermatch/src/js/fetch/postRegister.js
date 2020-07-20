import * as Clipboard from 'clipboard';
import modal, { modalAlert } from '../modal';

// get Parameter
const getParameter = (() => {
  const param = {};
  const queryString = window.location.search.substring(1);
  const regexr = /([^&=]+)=?([^&]*)/g;
  let match;
  while (match = regexr.exec(queryString)) {
    const paramName = decodeURIComponent(match[1].replace(/\+/g, ' '));
    const paramValue = decodeURIComponent(match[2].replace(/\+/g, ' '));
    param[paramName] = paramValue;
  }
  const channel = (() => {
    const channelString = param.channel || '';
    if (/^\d+$/.test(channelString)) {
      return channelString;
    }
    return 1;
  })();

  const smp = (() => {
    const urlString = param.click_key || '';
    if (!urlString) {
      return false;
    }
    return `click_key : ${urlString}`;
  })();

  return { channel, smp };
})();

// get OS Information
const getOS = (() => {
  const { userAgent } = window.navigator;
  const { platform } = window.navigator;
  const iosPlatforms = ['iPhone', 'iPad', 'iPod'];
  let os = 'PC';

  if (iosPlatforms.indexOf(platform) !== -1) {
    os = 'iOS';
  } else if (/Android/.test(userAgent)) {
    os = 'AOS';
  }
  return os;
})();

// alert message
const message = (() => {
  const getDate = () => {
    const date = new Date();
    return {
      y: date.getFullYear().toString(),
      m: (date.getMonth() + 1).toString(),
      d: date.getDate().toString(),
    };
  };
  return {
    id: '<p>휴대폰 번호를 정확히 입력해주세요.</p>',
    agree: '<p>필수 동의 항목에 모두 동의해주세요.</p>',
    taken: '<p>이미 신청이 완료된 번호입니다.</p>',
    end: '<h2>종료 안내</h2><p>이벤트가 종료되어 신청하실 수 없습니다.</p>',
    error: '<h2>오류 안내</h2><p>오류가 발생하였습니다. <br>다시 시도하여 주세요.</p>',
    success() {
      const now = getDate();
      return `<h2>이벤트 참여가 완료되었습니다.</h2><p>[넥슨코리아] ${now.y}년 ${now.m}월 ${now.d}일  이벤트 등<br> 프로모션 알림 수신 동의가 처리되었습니다.</p>`;
    },
  };
})();

// validation check
const checkValdation = (form) => {
  const formData = new FormData(form);
  const userValue = formData.get('userid');
  const agree = form.querySelectorAll('input[name=agree]');
  const regexr = /^((?!(0|1))\d{7,8})$/;
  const isAgreeAll = Array.from(agree).every((v) => v.checked);
  if (userValue.length < 1 || !regexr.test(userValue)) {
    modalAlert(message.id); // 휴대폰 번호를 정확히 입력해주세요.
    return false;
  }

  if (!isAgreeAll) {
    modalAlert(message.agree); // 필수 동의 항목에 모두 동의해주세요.
    return false;
  }

  return formData;
};

// vote event
const addEventVote = () => {
  const voteForm = document.querySelector('#voteForm');
  const registerButton = document.querySelector('#btnRegVote');
  // register vote
  const registerVote = (formData) => {
    const userValue = `${formData.get('option')}${formData.get('userid')}`;
    const teamNumber = formData.get('teamname');
    const data = {
      eventId: '109',
      eventIdName: 'kartrush_match1_20200519',
      lang: 'KR',
      channel: getParameter.channel,
      osType: getOS,
      mobile: userValue,
      voteTo: teamNumber,
    };

    modal.close('popConfirm');

    // 더미데이터 받아오기
    fetch('http://rongchyo.cafe24.com/project/2020/supermatch/dummyData/postVote.json', {
      method: 'GET', // 목업 json 호출이라 GET
      mode: 'no-cors',
    }).then((res) => res.json())
      .then((res) => {
        if (res.result) {
          modal.close('popVote');
          modalAlert(message.success(), true);
          return;
        }
        // error
        if (res.code === 17 || res.code === 18) {
          modalAlert(message.taken); // already taken number
        } else if (res.code === 3 || res.code === 16) {
          modalAlert(message.has); // closed event
        } else {
          modalAlert(message.error); // error
        }
      })
      .catch((error) => {
        console.error(error);
        modalAlert(message.error);
      });
  };
  voteForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if (checkValdation(this)) {
      modal.open('popConfirm');
    }
  });

  registerButton.addEventListener('click', function () {
    const formData = new FormData(voteForm);
    registerVote(formData);
  });
};

// share event
const addEventShare = () => {
  const shareForm = document.querySelector('#shareForm');
  const shareButton = document.querySelectorAll('button[data-tag]');
  // register share
  const registerShare = (formData, tag) => {
    const userInfo = `${formData.get('option')}${formData.get('userid')}`;
    const shareURL = 'https://youtu.be/UR5vATydsWA';
    const clipboard = new Clipboard('.btn_video_copy', {
      text() {
        return shareURL;
      },
    });
    clipboard.on('success', () => {
      window.alert('URL주소가 복사되었습니다. \n공유할 곳에 붙여넣기해주세요.');
    });

    // share sort
    const share = {
      twitter() {
        const title = '[카트라이더 러쉬플러스] 5월 31일 오후 6시 슈퍼 매치 실시!';
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareURL)}`, '', 'width=680, height=500');
      },
      facebook() {
        window.FB.ui({
          method: 'share',
          href: shareURL,
        }, (response) => {});
      },
      copy() {
        clipboard.destroy();
      },
    };

    const data = {
      eventIdName: 'kartrush_match2_20200519',
      userInfo,
      tag,
      countryCode: 'KR',
      osType: getOS,
      channel: getParameter.channel,
    };

    // 더미데이터 받아오기
    fetch('http://rongchyo.cafe24.com/project/2020/supermatch/dummyData/postShare.json', {
      method: 'GET', // 목업 json 호출이라 GET
      mode: 'no-cors',
    }).then((res) => res.json())
      .then((res) => {
        if (res.resultValue) {
          share[tag]();
          return;
        }
        if (res.returnCode === 3 || res.returnCode === 4) {
          modal.close('popVote');
          modalAlert(message.end); // closed event
          return;
        }
        modalAlert(message.end); // error
      })
      .catch((error) => {
        console.error(error);
        modalAlert(message.error);
      });
  };
  shareForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if (checkValdation(this)) {
      modal.open('popShareReg');
      modal.close('popShareID');
    }
  });

  Array.from(shareButton).forEach((v) => {
    v.addEventListener('click', function () {
      const formData = new FormData(shareForm);
      registerShare(formData, v.dataset.tag);
    });
  });
};

const addEventRegister = () => {
  addEventVote();
  addEventShare();
};

export default addEventRegister;
