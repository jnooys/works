import axios from 'axios';

const PRIKartrush = {
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
    PRIKartrush.callbackFuncName = funcName;
    PRIKartrush.eventType = eventType;
    axios
      .get('https://pri.nexon.com/Events/KartRush/AuthRequestCrypt')
      .then((resultData) => {
        switch (resultData.resultCode) {
          case 0:
            PRIKartrush.requestCrypt = resultData.resultValue.requestCrypt;
            PRIKartrush.IdentifyOpenPop();
            break;
          case -400:
            PRIKartrush.callbackFunc(-400);
            break;
          case 56:
            PRIKartrush.callbackFunc(-201);
            break;
          case -202:
            PRIKartrush.callbackFunc(-202);
            break;
          default:
            PRIKartrush.callbackFunc(-200);
        }
      })
      .catch(() => {
        PRIKartrush.callbackFunc(-203);
      });
  },

  IdentifyValid(_responseCrypt, _authCrypt) {
    this.authToken = _authCrypt;
    axios
      .post('https://pri.nexon.com/Events/KartRush/AuthTokenValid', {
        eventType: PRIKartrush.eventType,
        responseCrypt: _responseCrypt,
        authCrypt: _authCrypt,
      })
      .then((resultData) => {
        switch (resultData.resultCode) {
          case 0:
            PRIKartrush.validData = resultData.resultValue;
            PRIKartrush.callbackFunc(0);
            break;
          case -21:
          case -22:
          case -400:
            PRIKartrush.callbackFunc(resultData.resultCode);
            break;
          case 48:
            PRIKartrush.callbackFunc(-301);
            break;
          default:
            PRIKartrush.callbackFunc(-300);
        }
      })
      .catch(() => {
        PRIKartrush.callbackFunc(-302);
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
      apiParam['AuthToken'] = PRIKartrush.authToken;
      apiParam['CompareToken'] = PRIKartrush.validData.compareToken;
      apiParam['Name'] = PRIKartrush.validData.name;
      apiParam['Phone'] = PRIKartrush.validData.mobilePhone;
      apiParam['Birth'] = PRIKartrush.validData.birth;
    } catch (err) {
      onSuccess({ Result: -1 });
      return;
    }
    axios
      .post(
        `https://pri.nexon.com/Events/KartRush/${
          type == 'office' ? 'SonataEventOfficeJoin' : 'SonataEventNormalJoin'
        }`,
        apiParam,
      )
      .then(onSuccess)
      .catch(onError);
  },
};

export default PRIKartrush;
