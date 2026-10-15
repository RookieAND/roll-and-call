import { isNull } from "es-toolkit";

import type { AdminUser } from "../server/admin-data/types";

export function isSanctioned(user: AdminUser, now: number = Date.now()) {
  if (!user.sanction) return false;
  return isNull(user.sanction.until) || user.sanction.until.getTime() > now;
}
