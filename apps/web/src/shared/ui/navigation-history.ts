// ponytail: 앱 안에서 한 번이라도 이동했는지만 모듈 변수로 기억한다. 새로고침·직접 URL·디스코드 링크로
// 들어오면 false라 폴백 링크로 간다. 탭별로 정확한 스택이 필요해지면 sessionStorage로 옮긴다.
export const navigationHistory = { navigatedInApp: false };
