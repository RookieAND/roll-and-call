import { BADGE_LADDERS, parseBadgeKey } from "@roll-and-call/database/badges/model";

import type { BadgeView } from "./badge-view";
import { stepLook } from "./step-look";
import { stepName } from "./step-name";

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
    name: stepName({ step, categoryName }),
    grade: step.grade,
    look: stepLook(step),
    tier: record.tier,
    step,
    stepCount: definition.steps.length,
    categoryName,
    monthKey: definition.monthly ? parsed.subject : null,
  };
}
