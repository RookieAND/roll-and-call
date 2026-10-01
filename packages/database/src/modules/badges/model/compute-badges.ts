import { uniq } from "es-toolkit";

import type { BadgeFacts, EarnedBadge } from "./badge-facts";
import { badgeKey } from "./badge-key";
import { BADGE_LADDER, type BadgeLadderKey } from "./badge-ladder";
import { BADGE_LADDERS } from "./badge-ladders";
import { ladderEvents } from "./ladder-events";
import { reachedTier } from "./reached-tier";

function categoryIds(sessions: BadgeFacts["played"]): string[] {
  return uniq(sessions.flatMap((session) => session.categoryId ?? []));
}

// 이달의 GM·PL은 여러 사람을 견줘야 해서 monthlyWinners가 따로 판정한다.
export function computeBadges(facts: BadgeFacts): EarnedBadge[] {
  const earned: EarnedBadge[] = [];
  const add = (ladder: BadgeLadderKey, subject: string | null = null) => {
    const reached = reachedTier({
      steps: BADGE_LADDERS[ladder].steps,
      events: ladderEvents({ facts, ladder, subject }),
    });
    if (reached)
      earned.push({ badgeKey: badgeKey({ ladder, subject: subject ?? undefined }), ...reached });
  };

  add(BADGE_LADDER.playerTotal);
  add(BADGE_LADDER.gmTotal);
  add(BADGE_LADDER.playerReviews);
  for (const categoryId of categoryIds(facts.played)) add(BADGE_LADDER.playerRule, categoryId);
  for (const categoryId of categoryIds(facts.hosted)) add(BADGE_LADDER.gmRule, categoryId);
  add(BADGE_LADDER.gmVariety);
  add(BADGE_LADDER.gmReviews);
  return earned;
}
