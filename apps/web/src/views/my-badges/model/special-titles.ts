import {
  BADGE_LADDERS,
  BADGE_ROLE,
  HIDDEN_LADDER,
  isHiddenLadder,
} from "@roll-and-call/database/badges/model";

import type { BadgeView } from "@/entities/badge";
import { heldBadgeDetail } from "@/features/view-badge";
import type { BadgeRecord } from "@/shared/server";

// 「???」 카드는 기록으로 받는 숨겨진 칭호만 센다. 운영진·월 정산이 주는 지급형(작은 등불·더블 크라운·명예의 전당)은 뺀다(R29).
const HIDDEN_TITLE_COUNT = Object.values(HIDDEN_LADDER).filter(
  (ladder) => !BADGE_LADDERS[ladder].granted,
).length;

// 운영진 지급 칭호와 기록으로 받은 칭호(숨겨진 칭호·룰북 인증)를 구분하지 않고 받은 순서로. 못 받은 숨겨진 칭호 수만큼 「???」 카드를 잇는다(R29).
export function specialTitles({
  held,
  records,
  now,
}: {
  held: (BadgeView & { record: BadgeRecord })[];
  records: BadgeRecord[];
  now: Date;
}) {
  const specials = held
    .filter((badge) => badge.role === BADGE_ROLE.special)
    .toSorted((left, right) => left.record.earnedAt.getTime() - right.record.earnedAt.getTime());
  const earned = specials.filter((badge) => !BADGE_LADDERS[badge.ladder].granted);
  return {
    titles: specials.map((badge) => ({
      key: badge.key,
      emoji: badge.emoji,
      look: badge.look,
      name: badge.name,
      detail: heldBadgeDetail({ badge, records, facts: null, now }),
    })),
    unknownCount: Math.max(
      HIDDEN_TITLE_COUNT - earned.filter((badge) => isHiddenLadder(badge.ladder)).length,
      0,
    ),
  };
}

export type SpecialTitle = ReturnType<typeof specialTitles>["titles"][number];
