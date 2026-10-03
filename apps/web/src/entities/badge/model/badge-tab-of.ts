import { BADGE_ROLE } from "@roll-and-call/database/badges/model";

import { BADGE_TAB, type BadgeTab } from "./badge-tab";
import type { BadgeView } from "./badge-view";

// 이달의 GM·PL은 각 역할 탭 맨 아래에 두고, 특별 탭에는 특별 칭호만 둔다(R16, D235).
export function badgeTabOf(badge: Pick<BadgeView, "role">): BadgeTab {
  if (badge.role === BADGE_ROLE.special) return BADGE_TAB.special;
  return badge.role === BADGE_ROLE.gm ? BADGE_TAB.gm : BADGE_TAB.player;
}
