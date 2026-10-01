import { BADGE_ROLE, nextMonthStart } from "@roll-and-call/database/badges/model";

import { badgeRequirement, monthLabel, type BadgeView } from "@/entities/badge";
import { toKst } from "@/shared/lib";

export function badgeRowRequirement(badge: BadgeView): string {
  if (!badge.monthKey)
    return badgeRequirement({
      ladder: badge.ladder,
      step: badge.step,
      categoryName: badge.categoryName,
    });
  const role = badge.role === BADGE_ROLE.gm ? "운영" : "참여";
  const until = toKst(nextMonthStart(badge.monthKey)).endOf("month").format("M월 D일");
  return `${monthLabel(badge.monthKey)} ${role} 1위 · ${until}까지`;
}
