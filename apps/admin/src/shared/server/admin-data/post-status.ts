export const POST_STATUS = {
  recruiting: "모집 중",
  scheduling: "일정 조율 중",
  confirmed: "확정",
  ended: "종료",
} as const;

export type PostStatus = (typeof POST_STATUS)[keyof typeof POST_STATUS];
