import { BADGE_LADDERS, type BadgeEvent, type BadgeLadderKey } from "@roll-and-call/database/rules";

import type { BadgeRecord } from "@/shared/server";

// 저장본이 있으면 그것을, 판정이 아직 따라오지 않았으면 기록에서 바로 센 단계를 쓴다.
export function heldRecord(
  ladder: BadgeLadderKey,
  events: BadgeEvent[],
  record: BadgeRecord | undefined,
) {
  if (record) return { tier: record.tier, earnedAt: record.earnedAt, source: record.source };
  const steps = BADGE_LADDERS[ladder].steps;
  const tier = steps.filter((step) => step.threshold <= events.length).length;
  if (tier === 0) return null;
  return { tier, earnedAt: events[steps[tier - 1]!.threshold - 1]!.at, source: null };
}
