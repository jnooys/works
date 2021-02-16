import validationConfig, { ERROR_MESSAGE } from './validationConfig';

const returnCodeTable = {
  0: '성공',
  '-1': validationConfig.Certificate[0],
  '-2': validationConfig.Certificate[1],
  '-3': validationConfig.MemberNumber[0],
  '-4': validationConfig.Agree,
  '-5': validationConfig.Story[0],
  '-6': validationConfig.InstaLink[0],
  '-7': '팀원 1의 닉네임을 입력해주세요.',
  '-8': '팀원 2의 닉네임을 입력해주세요.',
  '-9': '팀원 3의 닉네임을 입력해주세요.',
  '-10': '팀원 4의 닉네임을 입력해주세요.',
  '-11': validationConfig.NickName[0],
  '-12': validationConfig.TeamName[0],
  '-13': validationConfig.CompanyName[0],
  '-14': validationConfig.NickNames[1],
  '-21': '직장인부는 만 19세 이상 직장인만 참여 가능합니다.',
  '-22': '일반부는 만 14세 이상만 참여 가능합니다.',
  '-104': '이미 신청이 완료된 번호입니다.',
  '-106': '이미 존재하는 팀명 입니다.',
  '-100': ERROR_MESSAGE('등록중 오류가 발생했습니다.'),
  '-101': ERROR_MESSAGE('EventId 가 전달되지 않았습니다.'),
  '-102': ERROR_MESSAGE('존재하지 않는 EventId 입니다.'),
  '-108': ERROR_MESSAGE(
    'NexonSN, UserIdentity1 중 하나는 필수로 전달되어야합니다.',
  ),
  '-200': '휴대폰 본인인증에 실패하였습니다.',
  '-201': '휴대폰 본인인증에 허용횟수가 초과하였습니다.',
  '-202': '휴대폰 본인인증에 허용되지 않는 접근입니다.',
  '-203': '휴대폰 본인인증에 실패하였습니다.',
  '-300': '휴대폰 본인인증에 실패하였습니다.',
  '-301': '휴대폰 본인인증 시간을 초과하였습니다.',
  '-302': '휴대폰 본인인증에 실패하였습니다.',
  '-303': '팝업이 차단되었습니다. <br>팝업 설정을 허용해주세요.',
  '-400': '<h2>종료 안내</h2><p>이벤트가 종료되어 신청하실 수 없습니다.</p>',
};

export default returnCodeTable;