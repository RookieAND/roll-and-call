// 칩은 한 번에 하나만 켠다. 괄호 설명은 칩 툴팁(USER_FILTER_HINT)이다.
export const USER_FILTERS = {
  gm: "GM",
  noshow: "불참 2회 이상",
  sanctioned: "제재 중",
  recent: "최근 가입",
} as const;
export type UserFilter = keyof typeof USER_FILTERS;

export const USER_FILTER_HINT: Partial<Record<UserFilter, string>> = {
  gm: "인증 룰북 있음",
  noshow: "최근 30일",
  recent: "7일 안",
};
