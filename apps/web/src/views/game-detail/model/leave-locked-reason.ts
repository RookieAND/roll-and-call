export const LEAVE_LOCK = {
  drawn: "drawn",
  expired: "expired",
  full: "full",
} as const;

export type LeaveLock = (typeof LEAVE_LOCK)[keyof typeof LEAVE_LOCK];

export const LEAVE_LOCKED_REASON: Record<LeaveLock, string> = {
  [LEAVE_LOCK.drawn]: "추첨이 끝나",
  [LEAVE_LOCK.expired]: "모집이 마감되어",
  [LEAVE_LOCK.full]: "정원이 차서",
};

export function leaveLock({ drawn, expired }: { drawn: boolean; expired: boolean }): LeaveLock {
  if (drawn) return LEAVE_LOCK.drawn;
  return expired ? LEAVE_LOCK.expired : LEAVE_LOCK.full;
}
