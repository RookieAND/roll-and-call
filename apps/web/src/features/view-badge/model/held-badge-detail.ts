import {
  BADGE_ROLE,
  kstMonthKey,
  ladderEvents,
  parseBadgeKey,
  type BadgeFacts,
} from "@roll-and-call/database/badges/model";

import type { BadgeView } from "@/entities/badge";
import type { BadgeRecord } from "@/shared/server";

import type { BadgeDetail } from "./badge-detail";
import { buildLadderDetail } from "./build-ladder-detail";
import { buildMonthlyDetail } from "./build-monthly-detail";

interface HeldBadgeDetailInput {
  badge: BadgeView & { record: BadgeRecord };
  records: BadgeRecord[];
  // 본인 화면만 넘긴다. null이면 남은 횟수·단계별 날짜 없이 받은 것만 보인다.
  facts: BadgeFacts | null;
  now: Date;
}

export function heldBadgeDetail({ badge, records, facts, now }: HeldBadgeDetailInput): BadgeDetail {
  if (badge.monthKey) {
    const months = records
      .flatMap((record) => {
        const parsed = parseBadgeKey(record.badgeKey);
        return parsed?.ladder === badge.ladder && parsed.subject ? [parsed.subject] : [];
      })
      .toSorted()
      .toReversed();
    const sessions = badge.role === BADGE_ROLE.gm ? facts?.hosted : facts?.played;
    const countOf = sessions
      ? (month: string) =>
          sessions.filter((session) => kstMonthKey(session.startsAt) === month).length
      : null;
    return buildMonthlyDetail({ ladder: badge.ladder, months, countOf, now });
  }
  const subject = parseBadgeKey(badge.key)?.subject ?? null;
  return buildLadderDetail({
    ladder: badge.ladder,
    categoryName: badge.categoryName,
    stepIndex: badge.tier - 1,
    held: { tier: badge.tier, earnedAt: badge.record.earnedAt, source: badge.record.source },
    events: facts ? ladderEvents({ facts, ladder: badge.ladder, subject }) : null,
  });
}
