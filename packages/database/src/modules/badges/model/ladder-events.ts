import type { BadgeFacts, BadgeReview, BadgeSession } from "./badge-facts";
import { BADGE_LADDER, type BadgeLadderKey } from "./badge-ladder";
import { hiddenEvents } from "./hidden-events";
import { isHiddenLadder } from "./is-hidden-ladder";
import type { BadgeEvent } from "./reached-tier";

function toEvents(sessions: BadgeSession[]): BadgeEvent[] {
  return sessions
    .toSorted((left, right) => left.endsAt.getTime() - right.endsAt.getTime())
    .map((session) => ({ at: session.endsAt, gameId: session.gameId }));
}

function toReviewEvents(reviews: BadgeReview[]): BadgeEvent[] {
  return reviews
    .toSorted((left, right) => left.createdAt.getTime() - right.createdAt.getTime())
    .map((review) => ({ at: review.createdAt, gameId: review.gameId }));
}

// 룰별 첫 운영이 다양성의 사건이다. 판본만 다른 책은 같은 분류라 한 번만 센다.
function firstOfEachCategory(events: BadgeSession[]): BadgeSession[] {
  const seen = new Set<string>();
  return events
    .toSorted((left, right) => left.endsAt.getTime() - right.endsAt.getTime())
    .filter((session) => {
      if (!session.categoryId || seen.has(session.categoryId)) return false;
      seen.add(session.categoryId);
      return true;
    });
}

// 룰별 사다리는 subject(룰 분류 id)의 세션만, 이달의 뱃지는 여러 사람을 견줘야 하고 특별 칭호는 오너가 줘서 빈 목록이다.
export function ladderEvents({
  facts,
  ladder,
  subject = null,
}: {
  facts: BadgeFacts;
  ladder: BadgeLadderKey;
  subject?: string | null;
}): BadgeEvent[] {
  if (isHiddenLadder(ladder)) return hiddenEvents({ facts, ladder });
  const { played, hosted, reviews, written } = facts;
  switch (ladder) {
    case BADGE_LADDER.playerTotal:
      return toEvents(played);
    case BADGE_LADDER.gmTotal:
      return toEvents(hosted);
    case BADGE_LADDER.playerRule:
      return toEvents(played.filter((session) => session.categoryId === subject));
    case BADGE_LADDER.gmRule:
      return toEvents(hosted.filter((session) => session.categoryId === subject));
    case BADGE_LADDER.playerVariety:
      return toEvents(firstOfEachCategory(played));
    case BADGE_LADDER.gmVariety:
      return toEvents(firstOfEachCategory(hosted));
    case BADGE_LADDER.gmReviews:
      return toReviewEvents(reviews);
    case BADGE_LADDER.playerReviews:
      return toReviewEvents(written);
    case BADGE_LADDER.scholar:
    case BADGE_LADDER.collector:
    case BADGE_LADDER.polymath:
    case BADGE_LADDER.library:
      return facts.certified;
    case BADGE_LADDER.playerMonthly:
    case BADGE_LADDER.gmMonthly:
    case BADGE_LADDER.developer:
    case BADGE_LADDER.guildMaster:
    case BADGE_LADDER.apprentice:
      return [];
  }
}
