import { BADGE_LADDER, BADGE_ROLE, isHiddenLadder } from "@roll-and-call/database/badges/model";

import { BADGE_TAB, type BadgeTab, type BadgeView } from "@/entities/badge";
import { heldBadgeDetail } from "@/features/view-badge";
import { toKst } from "@/shared/lib";
import type { BadgeRecord } from "@/shared/server";

import type { BadgeRowGroup } from "./badge-row";
import { badgeRowRequirement } from "./badge-row-requirement";

type HeldBadge = BadgeView & { record: BadgeRecord };

const ladderIs = (ladder: string) => (badge: HeldBadge) => badge.ladder === ladder;

// 이달의 GM·PL은 각 역할 탭 맨 아래, 특별 탭에는 특별 칭호만 둔다(R16, D235).
const GROUPS = {
  [BADGE_TAB.gm]: [
    { title: "누적", matches: ladderIs(BADGE_LADDER.gmTotal) },
    { title: "룰별", matches: ladderIs(BADGE_LADDER.gmRule) },
    { title: "다양한 룰", matches: ladderIs(BADGE_LADDER.gmVariety) },
    { title: "후기", matches: ladderIs(BADGE_LADDER.gmReviews) },
    { title: "이달의 기록", matches: ladderIs(BADGE_LADDER.gmMonthly) },
  ],
  [BADGE_TAB.player]: [
    { title: "누적", matches: ladderIs(BADGE_LADDER.playerTotal) },
    { title: "룰별", matches: ladderIs(BADGE_LADDER.playerRule) },
    { title: "후기", matches: ladderIs(BADGE_LADDER.playerReviews) },
    { title: "이달의 기록", matches: ladderIs(BADGE_LADDER.playerMonthly) },
  ],
  [BADGE_TAB.special]: [
    { title: "특별 칭호", matches: (badge: HeldBadge) => badge.role === BADGE_ROLE.special },
  ],
};

// 운영진 지급 칭호가 숨겨진 칭호보다 앞이고, 나머지는 받은 순서다.
const earlierFirst = (left: HeldBadge, right: HeldBadge) =>
  Number(isHiddenLadder(left.ladder)) - Number(isHiddenLadder(right.ladder)) ||
  left.record.earnedAt.getTime() - right.record.earnedAt.getTime();

export function roleGroups({
  tab,
  held,
  records,
  now,
}: {
  tab: BadgeTab;
  held: HeldBadge[];
  records: BadgeRecord[];
  now: Date;
}): BadgeRowGroup[] {
  return GROUPS[tab]
    .map((group) => ({
      key: group.title,
      title: group.title,
      rows: held
        .filter(group.matches)
        .toSorted(earlierFirst)
        .map((badge) => ({
          key: badge.key,
          emoji: badge.emoji,
          look: badge.look,
          name: badge.name,
          requirement: badgeRowRequirement(badge),
          dateLabel: toKst(badge.record.earnedAt).format("YY.MM.DD"),
          detail: heldBadgeDetail({ badge, records, facts: null, now }),
        })),
    }))
    .filter((group) => group.rows.length > 0);
}
