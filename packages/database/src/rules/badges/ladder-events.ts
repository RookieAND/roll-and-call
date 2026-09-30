import type { BadgeFacts, BadgeSession } from "./badge-facts";
import { BADGE_LADDER, type BadgeLadderKey } from "./badge-ladder";
import type { BadgeEvent } from "./reached-tier";

function toEvents(sessions: BadgeSession[]): BadgeEvent[] {
  return sessions
    .toSorted((left, right) => left.endsAt.getTime() - right.endsAt.getTime())
    .map((session) => ({ at: session.endsAt, gameId: session.gameId }));
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

// 사다리 하나를 채우는 사건(세션 종료·후기 작성)을 시각 순으로. n번째 사건이 n회 기준을 채운다.
// 룰별 사다리는 subject(룰 분류 id)의 세션만, 이달의 뱃지는 여러 사람을 견줘야 해서 빈 목록이다.
export function ladderEvents(
  { played, hosted, reviews }: BadgeFacts,
  ladder: BadgeLadderKey,
  subject: string | null = null,
): BadgeEvent[] {
  switch (ladder) {
    case BADGE_LADDER.playerTotal:
      return toEvents(played);
    case BADGE_LADDER.gmTotal:
      return toEvents(hosted);
    case BADGE_LADDER.playerRule:
      return toEvents(played.filter((session) => session.categoryId === subject));
    case BADGE_LADDER.gmRule:
      return toEvents(hosted.filter((session) => session.categoryId === subject));
    case BADGE_LADDER.gmVariety:
      return toEvents(firstOfEachCategory(hosted));
    case BADGE_LADDER.gmReviews:
      return reviews
        .toSorted((left, right) => left.createdAt.getTime() - right.createdAt.getTime())
        .map((review) => ({ at: review.createdAt, gameId: review.gameId }));
    case BADGE_LADDER.playerMonthly:
    case BADGE_LADDER.gmMonthly:
      return [];
  }
}
