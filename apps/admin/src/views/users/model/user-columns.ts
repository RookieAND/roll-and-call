// 시안 UCOLS. 숫자 열은 오른쪽, 상태는 가운데에 두고 남는 폭은 마지막 빈 열이 받는다.
export const USER_COLUMNS = [
  { label: "닉네임", width: 180, kind: "text" },
  { label: "가입일", width: 104, kind: "date" },
  { label: "연 세션", width: 74, kind: "number", align: "end" },
  { label: "참여 세션", width: 82, kind: "number", align: "end" },
  { label: "최근 3개월 불참", width: 120, kind: "number", align: "end" },
  { label: "인증 룰북", width: 82, kind: "number", align: "end" },
  { label: "상태", width: 96, kind: "badge", align: "center" },
  { label: "제재 종료", width: 92, kind: "date" },
] as const;
