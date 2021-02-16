import axios from 'axios';

const callAPI = {
  requestCrypt: '',
  authToken: '',
  validData: null,
  callbackFuncName: '',
  eventType: 'normal',

  callbackFunc(param) {
    this.callbackFuncName(param);
  },

  IdentifyOpenPop() {
    document.domain = 'nexon.com';
    const idpopup = window.open(
      'https://member.nexon.com/auth/owner_start.aspx?method=1&certifyReq=' +
        this.requestCrypt,
      'auth',
      'toolbar=no,location=no,scrollbars=no,height=550,width=425,resizable=0',
    );
    if (!idpopup) this.callbackFunc(-303);
  },

  IdentifyOpen(funcName, eventType) {
    callAPI.callbackFuncName = funcName;
    callAPI.eventType = eventType;
    /*axios
      .get('https://pri.nexon.com/Events/KartRush/AuthRequestCrypt')
      .then((resultData) => {
        switch (resultData.resultCode) {
          case 0:
            callAPI.requestCrypt = resultData.resultValue.requestCrypt;
            callAPI.IdentifyOpenPop();
            break;
          case -400:
            callAPI.callbackFunc(-400);
            break;
          case 56:
            callAPI.callbackFunc(-201);
            break;
          case -202:
            callAPI.callbackFunc(-202);
            break;
          default:
            callAPI.callbackFunc(-200);
        }
      })
      .catch(() => {
        callAPI.callbackFunc(-203);
      });
      */
    // dummy data
    callAPI.validData = {
      name: '홍길동',
      mobilePhone: '01012345678',
      birth: '1989-12-25',
    }

    callAPI.callbackFunc(0);
  },

  IdentifyValid(_responseCrypt, _authCrypt) {
    this.authToken = _authCrypt;
    axios
      .post('https://pri.nexon.com/Events/KartRush/AuthTokenValid', {
        eventType: callAPI.eventType,
        responseCrypt: _responseCrypt,
        authCrypt: _authCrypt,
      })
      .then((resultData) => {
        switch (resultData.resultCode) {
          case 0:
            callAPI.validData = resultData.resultValue;
            callAPI.callbackFunc(0);
            break;
          case -21:
          case -22:
          case -400:
            callAPI.callbackFunc(resultData.resultCode);
            break;
          case 48:
            callAPI.callbackFunc(-301);
            break;
          default:
            callAPI.callbackFunc(-300);
        }
      })
      .catch(() => {
        callAPI.callbackFunc(-302);
      });
  },
  IdentifyClear() {
    this.requestCrypt = this.authToken = this.callbackFuncName = '';
    this.validData = null;
    this.eventType = 'normal';
  },

  // 이벤트참가 신청하기
  SonataEventJoin(type, apiParam, onSuccess, onError) {
    try {
      apiParam['AuthToken'] = callAPI.authToken;
      apiParam['CompareToken'] = callAPI.validData.compareToken;
      apiParam['Name'] = callAPI.validData.name;
      apiParam['Phone'] = callAPI.validData.mobilePhone;
      apiParam['Birth'] = callAPI.validData.birth;
    } catch (err) {
      onSuccess({ Result: -1 });
      return;
    }
    /*axios
      .post(
        `https://pri.nexon.com/Events/KartRush/${
          type == 'office' ? 'SonataEventOfficeJoin' : 'SonataEventNormalJoin'
        }`,
        apiParam,
      )
      .then(onSuccess)
      .catch(onError);
    */

    // dummy data
    onSuccess({Result: 0});
  },
};

export default callAPI;
