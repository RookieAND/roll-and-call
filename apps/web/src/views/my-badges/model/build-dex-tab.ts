import {
  BADGE_LADDER,
  BADGE_LADDERS,
  BADGE_ROLE,
  ladderEvents,
  type BadgeLadderKey,
  type BadgeFacts,
  type BadgeRole,
  type MonthlyAppearance,
} from "@roll-and-call/database/rules";

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

// 도감 탭 하나(PL 참여 / GM 운영)의 모든 블록.
export function buildDexTab({ role, records, facts, appearances, userId, now }: DexTabInput) {
  const gm = role === BADGE_ROLE.gm;
  const counts = badgeCounts(facts);
  const recordsByKey = new Map(records.map((record) => [record.badgeKey, record]));
  const totalLadder = gm ? BADGE_LADDER.gmTotal : BADGE_LADDER.playerTotal;
  const ruleLadder = gm ? BADGE_LADDER.gmRule : BADGE_LADDER.playerRule;
  const totalCount = gm ? counts.gmTotal : counts.playerTotal;
  const reviewLadder = gm ? BADGE_LADDER.gmReviews : BADGE_LADDER.playerReviews;
  const reviewCount = gm ? counts.gmReviews : counts.playerReviews;
  const events = (ladder: BadgeLadderKey) => ladderEvents(facts, ladder);

  return {
    total: {
      title: gm ? "누적 운영" : "누적 참여",
      hint: `${totalCount}회 ${gm ? "진행" : "참석"}`,
      medals: ladderMedals(totalLadder, events(totalLadder), recordsByKey.get(totalLadder)),
      fillPercent: ladderFill(BADGE_LADDERS[totalLadder].steps, totalCount),
      next: ladderNext(totalLadder, totalCount),
    },
    rules: {
      title: gm ? "룰별 운영" : "룰별 참여",
      rows: ruleRows(ruleLadder, gm ? counts.gmRules : counts.playerRules, facts, recordsByKey),
    },
    variety: gm
      ? {
          title: "다양한 룰 운영",
          hint: `진행한 룰 ${counts.gmVariety}종`,
          note: "판본만 다른 같은 룰은 1종으로 셉니다",
          medals: ladderMedals(
            BADGE_LADDER.gmVariety,
            events(BADGE_LADDER.gmVariety),
            recordsByKey.get(BADGE_LADDER.gmVariety),
          ),
          next: ladderNext(BADGE_LADDER.gmVariety, counts.gmVariety),
        }
      : null,
    reviews: {
      title: gm ? "받은 후기" : "작성한 후기",
      hint: `${gm ? "받은" : "쓴"} 후기 ${reviewCount}개`,
      note: "운영진이 숨기거나 제거한 후기는 세지 않습니다",
      next: ladderNext(reviewLadder, reviewCount),
      medals: ladderMedals(reviewLadder, events(reviewLadder), recordsByKey.get(reviewLadder)),
    },
    monthly: monthlyCard({
      ladder: gm ? BADGE_LADDER.gmMonthly : BADGE_LADDER.playerMonthly,
      records,
      facts,
      appearances,
      userId,
      now,
    }),
  };
}

export type DexTab = ReturnType<typeof buildDexTab>;
