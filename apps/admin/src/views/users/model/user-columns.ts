// 시안 UCOLS. 숫자 열은 오른쪽에 둔다. 닉네임 열만 남는 폭을 받고 나머지는 고정 폭이다.
export const USER_COLUMNS = [
  { label: "닉네임", width: 240, kind: "text", sort: "nickname" },
  { label: "가입일", width: 140, kind: "date", sort: "joined" },
  { label: "연 세션", width: 72, kind: "number", align: "end", sort: "hosted" },
  { label: "참여 세션", width: 88, kind: "number", align: "end", sort: "played" },
  { label: "최근 30일 불참", width: 120, kind: "number", align: "end", sort: "noshow" },
  { label: "인증 룰북", width: 88, kind: "number", align: "end", sort: "certs" },
] as const;

// 활동 중 세그먼트에서만 보인다.
export const USER_STATE_COLUMN = { label: "상태", width: 120, kind: "badge" } as const;
