import {
  BADGE_LADDER,
  BADGE_LADDERS,
  BADGE_ROLE,
  ladderEvents,
  type BadgeLadderKey,
  type BadgeFacts,
  type BadgeRole,
  type MonthlyAppearance,
} from "@roll-and-call/database/badges/model";

import { badgeCounts } from "@/entities/badge";
import type { BadgeRecord } from "@/shared/server";

import { ladderFill } from "./ladder-fill";
import { ladderMedals } from "./ladder-medals";
import { ladderNext } from "./ladder-next";
import { monthlyCard } from "./monthly-card";
import { ruleRows } from "./rule-rows";

interface DexTabInput {
  role: BadgeRole;
  records: BadgeRecord[];
  facts: BadgeFacts;
  appearances: MonthlyAppearance[];
  userId: string;
  now: Date;
}

export function buildDexTab({ role, records, facts, appearances, userId, now }: DexTabInput) {
  const gm = role === BADGE_ROLE.gm;
  const counts = badgeCounts(facts);
  const recordsByKey = new Map(records.map((record) => [record.badgeKey, record]));
  const totalLadder = gm ? BADGE_LADDER.gmTotal : BADGE_LADDER.playerTotal;
  const ruleLadder = gm ? BADGE_LADDER.gmRule : BADGE_LADDER.playerRule;
  const totalCount = gm ? counts.gmTotal : counts.playerTotal;
  const events = (ladder: BadgeLadderKey) => ladderEvents({ facts, ladder });

  return {
    total: {
      title: gm ? "누적 운영" : "누적 참여",
      hint: `${totalCount}회 ${gm ? "진행" : "참석"}`,
      medals: ladderMedals({
        ladder: totalLadder,
        events: events(totalLadder),
        record: recordsByKey.get(totalLadder),
      }),
      fillPercent: ladderFill({ steps: BADGE_LADDERS[totalLadder].steps, count: totalCount }),
      next: ladderNext({ ladder: totalLadder, count: totalCount }),
    },
    rules: {
      title: gm ? "룰별 운영" : "룰별 참여",
      rows: ruleRows({
        ladder: ruleLadder,
        rules: gm ? counts.gmRules : counts.playerRules,
        facts,
        recordsByKey,
      }),
    },
    variety: gm
      ? {
          title: "다양한 룰 운영",
          hint: `진행한 룰 ${counts.gmVariety}종`,
          note: "판본만 다른 같은 룰은 1종으로 셉니다",
          medals: ladderMedals({
            ladder: BADGE_LADDER.gmVariety,
            events: events(BADGE_LADDER.gmVariety),
            record: recordsByKey.get(BADGE_LADDER.gmVariety),
          }),
          next: ladderNext({ ladder: BADGE_LADDER.gmVariety, count: counts.gmVariety }),
        }
      : null,
    monthly: monthlyCard({
      ladder: gm ? BADGE_LADDER.gmMonthly : BADGE_LADDER.playerMonthly,
      records,
      appearances,
      userId,
      now,
    }),
  };
}

export type DexTab = ReturnType<typeof buildDexTab>;
