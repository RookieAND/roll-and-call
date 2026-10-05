import {
  BADGE_LADDER,
  BADGE_LADDERS,
  BADGE_ROLE,
  isHiddenLadder,
  type BadgeLadderKey,
} from "@roll-and-call/database/badges/model";

import { BADGE_TAB, badgeRequirement, type BadgeTab, type BadgeView } from "@/entities/badge";
import { heldBadgeDetail } from "@/features/view-badge";
import { toKst } from "@/shared/lib";
import type { BadgeRecord } from "@/shared/server";

import type { BadgeRowGroup } from "./badge-row";
import { monthlyRow } from "./monthly-row";

type HeldBadge = BadgeView & { record: BadgeRecord };

const ladderIs = (ladder: string) => (badge: HeldBadge) => badge.ladder === ladder;

// 이달의 GM·PL은 각 역할 탭 맨 아래에 받은 달 기록 한 줄로, 특별 탭에는 특별 칭호만 둔다(R16, D235).
const GROUPS = {
  [BADGE_TAB.gm]: [
    { title: "누적", matches: ladderIs(BADGE_LADDER.gmTotal) },
    { title: "룰별", matches: ladderIs(BADGE_LADDER.gmRule) },
    { title: "다양한 룰", matches: ladderIs(BADGE_LADDER.gmVariety) },
    { title: "후기", matches: ladderIs(BADGE_LADDER.gmReviews) },
  ],
  [BADGE_TAB.player]: [
    { title: "누적", matches: ladderIs(BADGE_LADDER.playerTotal) },
    { title: "룰별", matches: ladderIs(BADGE_LADDER.playerRule) },
    { title: "다양한 룰 참여", matches: ladderIs(BADGE_LADDER.playerVariety) },
    { title: "후기", matches: ladderIs(BADGE_LADDER.playerReviews) },
  ],
  [BADGE_TAB.special]: [
    { title: "특별 칭호", matches: (badge: HeldBadge) => badge.role === BADGE_ROLE.special },
  ],
};

const MONTHLY_LADDER: Partial<Record<BadgeTab, BadgeLadderKey>> = {
  [BADGE_TAB.gm]: BADGE_LADDER.gmMonthly,
  [BADGE_TAB.player]: BADGE_LADDER.playerMonthly,
};

// 특별 탭은 받은 날을 연월일로 쓴다.
const DATE_FORMAT: Record<BadgeTab, string> = {
  [BADGE_TAB.gm]: "YY.MM.DD",
  [BADGE_TAB.player]: "YY.MM.DD",
  [BADGE_TAB.special]: "YYYY년 M월 D일",
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
  const groups: BadgeRowGroup[] = GROUPS[tab].map((group) => ({
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
        requirement:
          BADGE_LADDERS[badge.ladder].description ??
          badgeRequirement({
            ladder: badge.ladder,
            step: badge.step,
            categoryName: badge.categoryName,
          }),
        note: null,
        dateLabel: toKst(badge.record.earnedAt).format(DATE_FORMAT[tab]),
        detail: heldBadgeDetail({ badge, records, facts: null, now }),
      })),
  }));
  const monthlyLadder = MONTHLY_LADDER[tab];
  const monthly = monthlyLadder ? monthlyRow({ ladder: monthlyLadder, records, now }) : null;
  if (monthly) groups.push({ key: "monthly", title: "이달의 기록", rows: [monthly] });
  return groups.filter((group) => group.rows.length > 0);
}
