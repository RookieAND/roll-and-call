import { isNull } from "es-toolkit";

// 제재가 지금 걸려 있는가. 기한이 없으면 무기한이다.
export function isSanctioned(
  user: { sanction?: { until: Date | null } },
  now: number = Date.now(),
) {
  if (!user.sanction) return false;
  return isNull(user.sanction.until) || user.sanction.until.getTime() > now;
}
