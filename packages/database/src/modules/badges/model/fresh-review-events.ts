import type { BadgeFacts } from "./badge-facts";
import type { BadgeEvent } from "./reached-tier";

const FRESH_WINDOW_MS = 60 * 60 * 1000;

// PL로 참석한 세션이 끝나고 1시간 안에 쓴 후기. 사건은 후기를 쓴 시각.
export function freshReviewEvents(facts: BadgeFacts): BadgeEvent[] {
  const endByGame = new Map(facts.played.map((session) => [session.gameId, session.endsAt]));
  return facts.written
    .filter((review) => {
      const endsAt = endByGame.get(review.gameId);
      return (
        endsAt !== undefined && review.createdAt.getTime() - endsAt.getTime() <= FRESH_WINDOW_MS
      );
    })
    .toSorted((left, right) => left.createdAt.getTime() - right.createdAt.getTime())
    .slice(0, 1)
    .map((review) => ({ at: review.createdAt, gameId: review.gameId }));
}
