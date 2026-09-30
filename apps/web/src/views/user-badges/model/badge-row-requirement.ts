import { BADGE_ROLE, nextMonthStart } from "@roll-and-call/database/rules";

import { badgeRequirement, monthLabel, type BadgeView } from "@/entities/badge";
import { toKst } from "@/shared/lib";

// 목록 한 줄의 조건. 이달의 GM·PL은 몇 월 1위였고 언제까지 다는지를 보인다.
export function badgeRowRequirement(badge: BadgeView): string {
  if (!badge.monthKey) return badgeRequirement(badge.ladder, badge.step, badge.categoryName);
  const role = badge.role === BADGE_ROLE.gm ? "운영" : "참여";
  const until = toKst(nextMonthStart(badge.monthKey)).endOf("month").format("M월 D일");
  return `${monthLabel(badge.monthKey)} ${role} 1위 · ${until}까지`;
}
