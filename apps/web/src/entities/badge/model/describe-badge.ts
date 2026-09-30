import { BADGE_LADDERS, parseBadgeKey } from "@roll-and-call/database/rules";

import type { BadgeView } from "./badge-view";
import { stepName } from "./step-name";

// 정의에서 빠진 키나 이름을 알 수 없는 룰별 뱃지는 그리지 않는다.
export function describeBadge(record: {
  badgeKey: string;
  tier: number;
  categoryName: string | null;
}): BadgeView | null {
  const parsed = parseBadgeKey(record.badgeKey);
  if (!parsed) return null;
  const definition = BADGE_LADDERS[parsed.ladder];
  const step = definition.steps[record.tier - 1];
  if (!step) return null;
  if (definition.perRule && !record.categoryName) return null;
  const categoryName = definition.perRule ? record.categoryName : null;
  return {
    key: record.badgeKey,
    ladder: parsed.ladder,
    role: definition.role,
    emoji: step.emoji,
    name: stepName(step, categoryName),
    grade: step.grade,
    tier: record.tier,
    step,
    stepCount: definition.steps.length,
    categoryName,
    monthKey: definition.monthly ? parsed.subject : null,
  };
}
