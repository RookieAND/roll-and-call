import type { AdminUser } from "./types";

export function isSanctioned(user: AdminUser, now: number = Date.now()) {
  if (!user.sanction) return false;
  return user.sanction.until === null || user.sanction.until.getTime() > now;
}
