// 어드민에서 운영진이 정하는 닉네임 규칙(시안): 2~12자의 한글, 영문, 숫자.
const NICKNAME_PATTERN = /^[가-힣A-Za-z0-9]{2,12}$/;

export const NICKNAME_RULE_ERROR = "2~12자의 한글, 영문, 숫자로 입력해 주세요.";
export const NICKNAME_TAKEN_ERROR = "이미 다른 사용자가 쓰고 있는 닉네임입니다.";

export function followsNicknameRule(nickname: string) {
  return NICKNAME_PATTERN.test(nickname);
}
