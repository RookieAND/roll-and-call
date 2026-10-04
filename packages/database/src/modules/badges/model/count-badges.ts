import { BADGE_ROLE } from "./badge-ladder";
import { BADGE_LADDERS } from "./badge-ladders";
import { parseBadgeKey } from "./parse-badge-key";
import { previousMonthKey } from "./previous-month-key";

export type BadgeCount = { gm: number; pl: number; special: number; total: number };

// 업적 n개(R16). 단계형은 받은 단계마다 1개, 이달의 GM·PL은 지금 다는 것(지난달)만 1개, 특별 칭호는 1개씩.
export function countBadges(held: { badgeKey: string; tier: number }[], now: Date): BadgeCount {
  const heldMonth = previousMonthKey(now);
  const count = { gm: 0, pl: 0, special: 0 };
  for (const badge of held) {
    const parsed = parseBadgeKey(badge.badgeKey);
    if (!parsed) continue;
    const definition = BADGE_LADDERS[parsed.ladder];
    if (definition.monthly && parsed.subject !== heldMonth) continue;
    const amount = definition.monthly || definition.role === BADGE_ROLE.special ? 1 : badge.tier;
    if (definition.role === BADGE_ROLE.gm) count.gm += amount;
    else if (definition.role === BADGE_ROLE.player) count.pl += amount;
    else count.special += amount;
  }
  return { ...count, total: count.gm + count.pl + count.special };
}
