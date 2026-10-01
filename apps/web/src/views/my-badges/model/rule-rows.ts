import {
  BADGE_LADDERS,
  badgeKey,
  ladderEvents,
  type BadgeFacts,
  type BadgeLadderKey,
} from "@roll-and-call/database/badges/model";
import { isNull } from "es-toolkit";

import { lookTone, stepLook, type RuleCount } from "@/entities/badge";
import { buildLadderDetail, LADDER_META } from "@/features/view-badge";
import type { BadgeRecord } from "@/shared/server";

import { heldRecord } from "./held-record";
import { ladderNext } from "./ladder-next";

export function ruleRows({
  ladder,
  rules,
  facts,
  recordsByKey,
}: {
  ladder: BadgeLadderKey;
  rules: RuleCount[];
  facts: BadgeFacts;
  recordsByKey: Map<string, BadgeRecord>;
}) {
  const steps = BADGE_LADDERS[ladder].steps;
  return rules.map((rule) => {
    const key = badgeKey({ ladder, subject: rule.categoryId });
    const events = ladderEvents({ facts, ladder, subject: rule.categoryId });
    const record = recordsByKey.get(key);
    const held = heldRecord({ ladder, events, record });
    const tier = held?.tier ?? 1;
    const next = ladderNext({ ladder, count: rule.count, categoryName: rule.categoryName });
    const step = steps[tier - 1]!;
    return {
      key,
      emoji: step.emoji,
      look: stepLook(step),
      isNew: isNull(record?.seenAt),
      tier,
      tone: lookTone(stepLook(step)),
      stepCount: steps.length,
      countLabel: `${rule.count}${LADDER_META[ladder].unit}`,
      next: next.done ? null : next,
      name: `${rule.categoryName} ${step.name}`,
      detail: buildLadderDetail({
        ladder,
        categoryName: rule.categoryName,
        stepIndex: tier - 1,
        held,
        events,
      }),
    };
  });
}

export type RuleRow = ReturnType<typeof ruleRows>[number];
