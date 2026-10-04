// 시안 UCOLS. 숫자 열은 오른쪽에 둔다. width는 최소 폭이고 남는 폭은 열마다 고르게 나눈다.
export const USER_COLUMNS = [
  { label: "닉네임", width: 180, kind: "text", sort: "nickname" },
  { label: "가입일", width: 104, kind: "date", sort: "joined" },
  { label: "연 세션", width: 74, kind: "number", align: "end", sort: "hosted" },
  { label: "참여 세션", width: 82, kind: "number", align: "end", sort: "played" },
  { label: "최근 30일 불참", width: 120, kind: "number", align: "end", sort: "noshow" },
  { label: "인증 룰북", width: 82, kind: "number", align: "end", sort: "certs" },
] as const;

// 활동 중 세그먼트에서만 보인다.
export const USER_STATE_COLUMN = { label: "상태", width: 190, kind: "badge" } as const;
