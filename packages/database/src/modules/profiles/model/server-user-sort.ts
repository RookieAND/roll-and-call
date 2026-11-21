export const SERVER_USER_SORT = {
  recent: "recent",
  name: "name",
  rulebooks: "rulebooks",
  recruiting: "recruiting",
} as const;

export type ServerUserSort = (typeof SERVER_USER_SORT)[keyof typeof SERVER_USER_SORT];

export const SERVER_USERS_PAGE_SIZE = 20;

// 룰로 모집한 유저 필터가 보는 기간(개월)
export const HOSTED_RULE_RECENT_MONTHS = 3;
