import { BADGE_LADDER } from "@roll-and-call/database/badges/model";

import type { BadgeView } from "@/entities/badge";
import type { BadgeRecord } from "@/shared/server";

import { toSpecialTitle } from "./to-special-title";

// 운영진이 지급하는 GM 칭호. 받은 사람만 도감에 칸이 생긴다.
export function roleTitles({
  held,
  records,
  now,
}: {
  held: (BadgeView & { record: BadgeRecord })[];
  records: BadgeRecord[];
  now: Date;
}) {
  return held
    .filter((badge) => badge.ladder === BADGE_LADDER.creator)
    .map((badge) => toSpecialTitle({ badge, records, now }));
}
