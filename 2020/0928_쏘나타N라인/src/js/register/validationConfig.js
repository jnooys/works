export const ERROR_MESSAGE = (message) => `<h2>오류 안내</h2><p>${message}</p>`;

const validationConfig = {
  Certificate: [
    '휴대폰 번호 인증을 완료해주세요.',
    '인증이 유효하지 않습니다.',
  ],
  TeamName: ['팀명을 입력해주세요.'],
  CompanyName: ['회사명을 입력해주세요.'],
  MemberNumber: ['회원번호를 입력해주세요.'],
  NickName: ['게임 닉네임을 입력해주세요.'],
  NickNames: [
    '팀원의 게임 닉네임을 입력해주세요',
    '팀원들의 닉네임에 중복이 존재합니다.',
  ],
  Story: ['참가 사연을 입력해주세요.'],
  InstaLink: ['URL을 입력해주세요.'],
  Agree: '필수 동의 항목에 모두 동의해주세요.',
  Error: ERROR_MESSAGE('오류가 발생하였습니다. <br>다시 시도하여 주세요.'),
};

export default validationConfig;
