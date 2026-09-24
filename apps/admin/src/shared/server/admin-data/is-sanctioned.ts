import type { AdminUser } from "./types";

// 기한이 없으면(무기한) 해제될 때까지 제재 중이다.
export function isSanctioned(user: AdminUser, now: number = Date.now()) {
  if (!user.sanction) return false;
  return user.sanction.until === null || user.sanction.until.getTime() > now;
}
