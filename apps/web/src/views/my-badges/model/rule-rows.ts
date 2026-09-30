import {
  BADGE_LADDERS,
  badgeKey,
  ladderEvents,
  type BadgeFacts,
  type BadgeLadderKey,
} from "@roll-and-call/database/rules";

import { gradeTone, type RuleCount } from "@/entities/badge";
import { buildLadderDetail, LADDER_META } from "@/features/view-badge";
import type { BadgeRecord } from "@/shared/server";

import { heldRecord } from "./held-record";
import { ladderNext } from "./ladder-next";

// 룰별 한 줄: 지금 단계 메달, 4칸 단계 점, 다음 단계까지 남은 횟수. 해 본 룰만 온다.
export function ruleRows(
  ladder: BadgeLadderKey,
  rules: RuleCount[],
  facts: BadgeFacts,
  recordsByKey: Map<string, BadgeRecord>,
) {
  const steps = BADGE_LADDERS[ladder].steps;
  return rules.map((rule) => {
    const key = badgeKey(ladder, rule.categoryId);
    const events = ladderEvents(facts, ladder, rule.categoryId);
    const record = recordsByKey.get(key);
    const held = heldRecord(ladder, events, record);
    const tier = held?.tier ?? 1;
    const step = steps[tier - 1]!;
    return {
      key,
      emoji: step.emoji,
      grade: step.grade,
      isNew: record?.seenAt === null,
      tier,
      tone: gradeTone(step.grade),
      stepCount: steps.length,
      countLabel: `${rule.count}${LADDER_META[ladder].unit}`,
      next: ladderNext(ladder, rule.count, rule.categoryName),
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
