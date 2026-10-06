import { BADGE_ROLE, HIDDEN_LADDER, isHiddenLadder } from "@roll-and-call/database/badges/model";
import { partition } from "es-toolkit";

import type { BadgeView } from "@/entities/badge";
import type { BadgeRecord } from "@/shared/server";

import { toSpecialTitle } from "./to-special-title";

const HIDDEN_TITLE_COUNT = Object.keys(HIDDEN_LADDER).length;

// 운영진 지급 칭호가 앞, 그다음 받은 숨겨진 칭호를 받은 순서로. 못 받은 숨겨진 칭호 수만큼 「???」 카드를 잇는다(R29).
export function specialTitles({
  held,
  records,
  now,
}: {
  held: (BadgeView & { record: BadgeRecord })[];
  records: BadgeRecord[];
  now: Date;
}) {
  const [hidden, granted] = partition(
    held.filter((badge) => badge.role === BADGE_ROLE.special),
    (badge) => isHiddenLadder(badge.ladder),
  );
  const earnedOrder = hidden.toSorted(
    (left, right) => left.record.earnedAt.getTime() - right.record.earnedAt.getTime(),
  );
  return {
    titles: [...granted, ...earnedOrder].map((badge) => toSpecialTitle({ badge, records, now })),
    unknownCount: Math.max(HIDDEN_TITLE_COUNT - hidden.length, 0),
  };
}
