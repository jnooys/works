import axios from 'axios';
import Modal from '../modules/modal';
import PRIKartrush from './PRIKartrush';
import returnCodeTable from './returnCodeTable';
import validationConfig from './validationConfig';

const modal = new Modal();

// common variables
let registerForm;
let certField;
let inputType;
let agreeArray;
let agreeAll;
let agreePolicy;

const getChannel = (function () {
  const urlParams = (() => {
    const urlParams = {};
    const queryString = window.location.search.substring(1);
    let match;
    while ((match = /([^&=]+)=?([^&]*)/g.exec(queryString))) {
      const paramName = decodeURIComponent(match[1].replace(/\+/g, ' '));
      const paramValue = decodeURIComponent(match[2].replace(/\+/g, ' '));
      urlParams[paramName] = paramValue;
    }
    return urlParams;
  })();

  const channelString = urlParams['channel'] || '';
  if (/^\d+$/.test(channelString)) {
    return channelString;
  }
  return 1;
})();

// 폼 만들기
const controlForm = (() => {
  const keyupEventConfig = {
    TeamName: (event) => {
      const { target } = event;
      target.value = target.value.replace(/[^0-9ㄱ-ㅎ가-힣a-zA-Z]/g, '');
    },
    CompanyName: (event) => {
      const { target } = event;
      target.value = target.value.replace(/\s/g, '');
    },
    MemberNumber: (event) => {
      const { target } = event;
      target.value = target.value.replace(/[^0-9a-zA-Z]/g, '');
    },
    InstaLink: (event) => {
      const { target } = event;
      target.value = target.value.replace(/\s/g, '');
    },
    NickName: (event) => {
      const { target } = event;
      target.value = target.value.replace(/\s/g, '');
    },
  };

  let formtype;
  let titleType;

  function init() {
    titleType = document.querySelector('#titleType');
  }

  function eventOpenNPSN() {
    modal.open('modalNPSN');
  }

  // create form
  function create(type) {
    const formConfig = {
      Type1: {
        title: '직장인부',
        form: [
          {
            label: '팀명',
            name: 'TeamName',
            type: 'input',
            placeholder: '팀명 입력',
          },
          {
            label: '회사명',
            name: 'CompanyName',
            type: 'input',
            placeholder: '회사명 입력',
          },
          {
            label: '팀장 회원번호',
            name: 'MemberNumber',
            type: 'input',
            placeholder: '회원번호 입력',
            option: {
              type: 'button',
              text: '회원번호 확인',
              attr: [
                { key: 'type', value: 'button' },
                { key: 'class', value: 'btn_NPSN' },
              ],
            },
          },
          {
            label: '팀원 게임 닉네임',
            name: 'NickName',
            id: ['NickName1', 'NickName2', 'NickName3', 'NickName4'],
            placeholder: [
              '팀원1 게임 닉네임',
              '팀원2 게임 닉네임',
              '팀원3 게임 닉네임',
              '팀원4 게임 닉네임',
            ],
            type: 'input',
            option: {
              type: 'li',
              text: [
                '- 정확한 팀원의 카트라이더 러쉬플러스 닉네임을 기재하지 않을 경우 선발제한될 수 있습니다.',
                '- 정확한 팀원의 닉네임을 기입하지 않을 경우 참가에 제한이 있을 수 있습니다. (공백, 특수 기호 등)',
                '- 닉네임에 부적절한 단어가 포함될 시 선발 대상에서 제외될 수 있습니다.',
                '- 제출된 닉네임은 변경 불가능하며, 참가 신청 및 대회 기간 중 닉네임 변경 시 참가에 불이익이 있을 수 있습니다. ',
              ],
            },
          },
          {
            label: '참가 사연',
            name: 'Story',
            type: 'textarea',
            placeholder:
              '쏘나타 N 라인 컵에 참가하게 된 사연 및 참가 예정인 팀원의 구성 등을 기입해주세요.',
          },
        ],
      },
      Type2: {
        title: '일반부',
        form: [
          {
            label: '회원번호',
            name: 'MemberNumber',
            type: 'input',
            placeholder: '회원번호 입력',
            option: {
              type: 'button',
              text: '회원번호 확인',
              attr: [
                { key: 'type', value: 'button' },
                { key: 'class', value: 'btn_NPSN' },
              ],
            },
          },
          {
            label: '게임 닉네임',
            name: 'NickName',
            type: 'input',
            placeholder: '닉네임 입력',
          },
          {
            label: '[쏘나타 N 라인 인증하고 치킨먹자!] 이벤트 참여 게시물 링크',
            name: 'InstaLink',
            type: 'textarea',
            placeholder: '게시물 링크 URL 입력',
            option: {
              type: 'p',
              text:
                '※ 인스타그램 이미지는 결승 진출 시 대회 페이지에서 활용될 수 있으며, 넥슨에서 원본 사진을 요청할 수 있습니다.',
            },
          },
        ],
      },
    };

    const registerType = formConfig[type];
    formtype = createFormtype();

    function createFormtype() {
      const div = document.createElement('div');
      div.setAttribute('class', 'formtype');

      return div;
    }

    function createTitleType() {
      titleType.innerText = registerType.title;
      titleType.setAttribute('class', type);
    }

    function createInputType() {
      inputType.value = type;
      inputType.insertAdjacentElement('afterend', formtype);
    }

    function createField(input, label, option) {
      const div = document.createElement('div');
      div.setAttribute('class', 'field');
      option && div.prepend(option);
      div.prepend(input);
      div.prepend(label);

      return div;
    }

    function createLabel(v) {
      const label = document.createElement('label');
      label.setAttribute('for', v.id ? v.id[0] : v.name);
      label.innerText = v.label;

      return label;
    }

    function createInput(v) {
      const { name } = v;
      if (v.id) {
        const div = document.createElement('div');
        v.id.forEach((id, index) => {
          const input = document.createElement('input');
          setAttributes(input, {
            type: 'text',
            name,
            id,
            placeholder: v.placeholder[index],
          });
          input.addEventListener('keyup', keyupEventConfig[name]);
          div.append(input);
        });

        return div;
      }

      const input = document.createElement(v.type);
      setAttributes(input, { id: name, name, placeholder: v.placeholder });

      if (v.type === 'input') {
        input.setAttribute('type', 'text');
        input.addEventListener('keyup', keyupEventConfig[name]);
      }

      return input;
    }

    function createOption(option) {
      if (!option) return false;
      if (option.type === 'li') {
        const optionElement = document.createElement('ul');

        optionElement.innerHTML = option.text.reduce(
          (a, v) => (a += `<li>${v}</li>`),
          '',
        );

        return optionElement;
      }

      const optionElement = document.createElement(option.type);
      optionElement.append(option.text);
      if (option.attr) {
        option.attr.forEach((v) => {
          optionElement.setAttribute(v.key, v.value);
        });
      }

      return optionElement;
    }

    function addEventNPSN() {
      const button = formtype.querySelector('.btn_NPSN');
      button.addEventListener('click', eventOpenNPSN);
    }

    registerType.form.forEach((v) => {
      formtype.append(
        createField(createInput(v), createLabel(v), createOption(v.option)),
      );
    });

    createTitleType();
    createInputType();
    addEventNPSN();
  }

  // destroy form
  function destroy() {
    modal.close('modalRegister', clearForm);
    PRIKartrush.IdentifyClear();

    function clearForm() {
      clearTitleType();
      clearInputType();
      clearInput();
      clearCertiField();
      clearCertiButton();
      clearAgree();
    }

    function clearAgree() {
      agreeArray.forEach((v) => {
        v.value = 'N';
        v.checked = false;
      });
      agreeAll.checked = false;
    }

    function clearTitleType() {
      titleType.innerText = '';
    }

    function clearInputType() {
      inputType.value = null;
    }

    function clearInput() {
      const inputArray = Array.from(
        formtype.querySelectorAll('input[type=text], textarea'),
      );
      inputArray.forEach((v) => {
        v.removeEventListener('keyup', keyupEventConfig[v.name]);
        v.remove();
      });
      formtype.remove();
    }

    function clearCertiField() {
      const certiArray = Array.from(certField.querySelectorAll('input'));
      certiArray.forEach((v) => {
        v.value = '';
      });
    }

    function clearCertiButton() {
      const certiButton = certField.querySelector('button');
      certiButton.innerHTML = '휴대폰 본인인증';
      certiButton.disabled = false;
    }
  }

  return { init, create, destroy };
})();

// init
function initDOM() {
  registerForm = document.querySelector('#registerForm');
  certField = document.querySelector('#certField');
  inputType = registerForm.querySelector('#Type');
  agreePolicy = document.querySelector('#agreePolicy');
  agreeArray = Array.from(registerForm.querySelectorAll('input[name=Agree]'));
  agreeAll = registerForm.querySelector('input[id=AgreeAll]');
}

// 인증하기
function certificate() {
  const button = certField.querySelector('button');
  button.addEventListener('click', function () {
    const type = getType(inputType.value);
    PRIKartrush.IdentifyOpen(callbackCert, type);
  });
}

// callbackCert
function callbackCert(resultCode) {
  if (resultCode === 0) {
    const button = certField.querySelector('button');

    certField.querySelector('input#Name').value = PRIKartrush.validData.name;
    certField.querySelector('input#Phone').value =
      PRIKartrush.validData.mobilePhone;
    certField.querySelector('input#Birth').value = PRIKartrush.validData.birth;
    button.innerHTML = '인증완료 <span class="icon"></span>';
    button.disabled = true;
    button.classList.add('disabled');
    modal.alert('휴대폰 본인인증을 완료하였습니다.');
    return;
  }

  if (resultCode === -21 || resultCode === -22) {
    controlForm.destroy();
    modal.alert(returnCodeTable[resultCode.toString()]);
    return;
  }

  modal.alert(returnCodeTable[resultCode.toString()] || validationConfig.Error);
}

// return type
function getType(type) {
  return type === 'Type1' ? 'office' : 'normal';
}

// 폼 넘기기
function submitRegister() {
  registerForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const parameter = validate();
    if (!parameter) return;
    PRIKartrush.SonataEventJoin(
      parameter.type,
      parameter.data,
      // success
      (data) => {
        if (data.Result == 0) {
          successCallback(parameter.type);
        } else {
          modal.alert(
            returnCodeTable[data.Result.toString()] || validationConfig.Error,
          );
        }
      },
      // fail
      () => {
        modal.alert(validationConfig.Error);
      },
    );
  });

  // 밸리데이션 체크
  function validate() {
    // 휴대폰 인증 확인
    if (!PRIKartrush.validData) {
      modal.alert(validationConfig.Certificate[0]);
      return false;
    }

    // input 값 확인
    const inputArray = Array.from(
      registerForm.querySelectorAll('input[type=text], textarea'),
    );
    const modalElement = document.querySelector('#modalRegister .modal_wrap');

    for (let i = 0; i < inputArray.length; i++) {
      const input = inputArray[i];
      const { name } = input;

      if (!checkLength(name) || (/\d$/.test(input.id) && !checkOverlap(name))) {
        modalElement.scrollTop =
          input.closest('.field')?.getBoundingClientRect().top +
            modalElement.scrollTop || 0;
        return false;
      }
    }

    // 동의 확인
    if (agreeArray.find((v) => v.value !== 'Y')) {
      modal.alert(validationConfig.Agree);
      return false;
    }

    return {
      type: getType(inputType.value),
      data: [...inputArray, ...agreeArray].reduce((a, v) => {
        a[v.id] = v.value;
        return a;
      }, {}),
    };

    // 직장인부 팀원 닉네임 중복 확인
    function checkOverlap(name) {
      const nicknameInput = Array.from(
        registerForm.querySelectorAll(`input[name=${name}]`),
      );
      const NickNames = nicknameInput.map((v) => v.value);

      if (
        NickNames.some((v) => NickNames.indexOf(v) !== NickNames.lastIndexOf(v))
      ) {
        modal.alert(validationConfig.NickNames[1], nicknameInput[0]);
        return false;
      }
      return true;
    }

    // input, textarea 값 있는지 확인
    function checkLength(name) {
      const inputArray = registerForm.querySelectorAll(`[name=${name}]`);
      for (let i = 0; i < inputArray.length; i++) {
        const input = inputArray[i];
        if (input.value.length < 1) {
          modal.alert(validationConfig[name], input);
          return false;
        }
      }
      return true;
    }
  }

  // push MSMS
  function pushMSMS(mobile, type) {
    const parameterMSMS = {
      eventIdName: 'kartrush_kr_20200928',
      userInfo: mobile,
      countryCode: 'KR',
      channel: getChannel,
      osType: '',
      tag: type,
    };

    axios.post('https://eventwebapi.nexon.com/InsertMSMS', parameterMSMS);
  }

  // success
  function successCallback(type) {
    const date = new Date();
    pushMSMS(PRIKartrush.validData.mobilePhone, type);
    controlForm.destroy();
    modal.alert(
      `[넥슨코리아] ${date.getFullYear()}년 ${
        date.getMonth() + 1
      }월 ${date.getDate()}일 이벤트 등 프로모션 알림<br> 수신동의가 처리되었습니다.`,
      null,
      'modalSuccess',
    );
  }
}

// 동의하기 체크박스 이벤트
function agreeCheck() {
  function checkAll(event) {
    const { target } = event;
    target.value = target.value === 'N' ? 'Y' : 'N';
    if (!agreeArray.map((v) => v.checked).includes(false)) {
      agreeAll.checked = true;
    } else {
      agreeAll.checked = false;
    }
  }

  function checkAgree(event) {
    const { checked } = event.target;

    agreeArray.forEach((v) => {
      if (checked) {
        v.value = 'Y';
        v.checked = true;
      } else {
        v.value = 'N';
        v.checked = false;
      }
    });
  }

  agreeArray.forEach((v) => {
    v.addEventListener('change', checkAll);
  });
  agreeAll.addEventListener('change', checkAgree);
}

// 참가 부문 선택
function controlModalType() {
  const id = 'modalType';
  const name = 'SelectType';
  const typeForm = document.querySelector('#typeForm');

  openModal();
  submitModal();
  closeModalButton();

  function submitModal() {
    typeForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const type = Array.from(
        this.querySelectorAll(`input[name=${name}]`),
      ).find((v) => v.checked);
      if (!type) {
        modal.alert('신청 부문을 선택해주세요.');
        return;
      }
      controlForm.create(type.value);
      closeModal();
      modal.open('modalRegister');
    });
  }

  function openModal() {
    const button = document.querySelector('#openRegister');

    button.addEventListener('click', function () {
      if (agreePolicy.checked) {
        const type = document.querySelector('#tab div.active').dataset.type;
        modal.open(id);
        typeForm.querySelector(`#${type}`).checked = true;
        agreePolicy.checked = false;
      } else {
        modal.alert(
          '참가신청 유의사항을 숙지하시고<br>체크박스에 체크 후 참가신청해주세요.',
        );
      }
    });
  }

  function closeModalButton() {
    const button = document.querySelector(`#${id} .btn_x`);
    button.addEventListener('click', closeModal);
  }

  function closeModal() {
    modal.close(id, cloasCallback);

    function cloasCallback() {
      const inputArray = Array.from(
        typeForm.querySelectorAll(`input[name=${name}]`),
      );
      inputArray.forEach((v) => {
        v.checked = false;
      });
    }
  }
}

// 폼 닫기
function closeRegister() {
  const modalRegister = document.querySelector('#modalRegister');
  const button = Array.from(
    modalRegister.querySelectorAll(
      '#modalRegister .btn_x, #modalRegister .btn_cancel',
    ),
  );
  button.forEach((v) => {
    v.addEventListener('click', function () {
      controlForm.destroy();
    });
  });
}

// 신청 성공 팝업 닫기
function closeSuccess() {
  const id = 'modalSuccess';
  const modalElement = document.querySelector(`#${id}`);
  const button = Array.from(modalElement.querySelectorAll(`#${id} button`));

  function callback() {
    modalElement.querySelector('.alert_wrap').innerHTML = '';
  }

  button.forEach((v) => {
    v.addEventListener('click', function () {
      window.scrollTo(0, 0);
      modal.close(id, callback);
    });
  });
}

// 얼럿 닫기
function closeAlert() {
  const id = 'modalAlert';
  const modalElement = document.querySelector(`#${id}`);
  const button = Array.from(modalElement.querySelectorAll('button'));

  button.forEach((v) => {
    v.addEventListener('click', function () {
      modal.close(id, cloasCallback);
    });
  });

  function cloasCallback() {
    modalElement.querySelector('.alert_wrap').innerHTML = '';
    modal.focusing && modal.focusing.focus();
    modal.focusing = null;
  }
}

// 개인정보 동의 팝업 열기
function openAgree1() {
  const button = document.querySelector('#modalRegister .btn_agree1');
  button.addEventListener('click', open);

  function open() {
    const id = 'modalAgree1';
    modal.open(id);
    const modalElement = document.querySelector(`#${id}`);
    const agree1 = Array.from(modalElement.querySelectorAll('[data-type]'));
    const agreeType = inputType.value;
    agree1.forEach((v) => {
      if (v.dataset.type === agreeType) {
        v.style.display = 'inline';
      } else {
        v.style.display = '';
      }
    });
  }
}

// 일반부, 직장인부 탭
function initTab() {
  const tab = document.querySelector('#tab');
  const tabNav = Array.from(tab.querySelectorAll('.nav a'));
  const CLASS_NAME = 'active';

  tabNav.forEach((v) => {
    v.addEventListener('click', function (e) {
      e.preventDefault();

      if (v.classList.contains(CLASS_NAME)) return;

      agreePolicy.checked = false;
      tab.querySelector(`#${v.href.split('#')[1]}`).classList.add(CLASS_NAME);
      v.classList.add(CLASS_NAME);

      tabNav
        .filter((t) => v !== t)
        .map((t) => {
          t.classList.remove(CLASS_NAME);
          tab
            .querySelector(`#${t.href.split('#')[1]}`)
            .classList.remove(CLASS_NAME);
        });
    });
  });
}

// setAttributes
function setAttributes(el, attrs) {
  for (let key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
}

window.addEventListener('DOMContentLoaded', function () {
  initDOM();
  controlForm.init();
  submitRegister();
  controlModalType();
  closeRegister();
  closeAlert();
  closeSuccess();
  initTab();
  certificate();
  agreeCheck();
  openAgree1();
});
