export const CLOSED_REASON = {
  // 기한이 지났다.
  expired: "expired",
  // 대기를 받지 않는 글의 정원이 찼다.
  full: "full",
  // 세션 시간이 정해져 더는 받지 않는다.
  sessionSet: "session-set",
} as const;

export type ClosedReason = (typeof CLOSED_REASON)[keyof typeof CLOSED_REASON];
