import type { BadgeFacts } from "./badge-facts";
import type { BadgeEvent } from "./reached-tier";

const FRESH_WINDOW_MS = 60 * 60 * 1000;

// PL로 참석한 세션이 끝나고 1시간 안에 쓴 후기. 사건은 후기를 쓴 시각.
export function freshReviewEvents(facts: BadgeFacts): BadgeEvent[] {
  // 다회차 후기는 그 회차의 종료와, 단발은 구인의 종료와 맞춘다.
  const keyOf = ({ gameId, roundId }: { gameId: string; roundId: string | null }) =>
    roundId ?? gameId;
  const endByKey = new Map(facts.played.map((session) => [keyOf(session), session.endsAt]));
  return facts.written
    .filter((review) => {
      const endsAt = endByKey.get(keyOf(review));
      return (
        endsAt !== undefined && review.createdAt.getTime() - endsAt.getTime() <= FRESH_WINDOW_MS
      );
    })
    .toSorted((left, right) => left.createdAt.getTime() - right.createdAt.getTime())
    .slice(0, 1)
    .map((review) => ({ at: review.createdAt, gameId: review.gameId }));
}
