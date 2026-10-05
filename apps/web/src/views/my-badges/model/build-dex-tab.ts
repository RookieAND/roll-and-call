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
  const reviewLadder = gm ? BADGE_LADDER.gmReviews : BADGE_LADDER.playerReviews;
  const reviewCount = gm ? counts.gmReviews : counts.playerReviews;
  const varietyLadder = gm ? BADGE_LADDER.gmVariety : BADGE_LADDER.playerVariety;
  const varietyCount = gm ? counts.gmVariety : counts.playerVariety;
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
    variety: {
      title: gm ? "다양한 룰 운영" : "다양한 룰 참여",
      hint: gm ? `진행한 룰 ${counts.gmVariety}종` : `참석한 룰 ${counts.playerVariety}종`,
      note: "판본만 다른 같은 룰은 1종으로 셉니다",
      medals: ladderMedals({
        ladder: varietyLadder,
        events: events(varietyLadder),
        record: recordsByKey.get(varietyLadder),
      }),
      next: ladderNext({ ladder: varietyLadder, count: varietyCount }),
    },
    reviews: {
      title: gm ? "받은 후기" : "작성한 후기",
      hint: `${reviewCount}건 ${gm ? "받음" : "작성"}`,
      medals: ladderMedals({
        ladder: reviewLadder,
        events: events(reviewLadder),
        record: recordsByKey.get(reviewLadder),
      }),
      fillPercent: ladderFill({ steps: BADGE_LADDERS[reviewLadder].steps, count: reviewCount }),
      next: ladderNext({ ladder: reviewLadder, count: reviewCount }),
    },
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
