export const SERVER_USER_SORT = {
  recruiting: "recruiting",
  recent: "recent",
  name: "name",
  rulebooks: "rulebooks",
  played: "played",
  hosted: "hosted",
} as const;

export type ServerUserSort = (typeof SERVER_USER_SORT)[keyof typeof SERVER_USER_SORT];

// 모바일 한 쪽 분량. 데스크톱은 이 안에서 3열에 맞게 9명만 보인다(views/users).
export const SERVER_USERS_PAGE_SIZE = 10;

// 룰로 모집한 유저 필터가 보는 기간(개월)
export const HOSTED_RULE_RECENT_MONTHS = 3;
