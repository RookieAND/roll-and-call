import type { BadgeFacts } from "./badge-facts";
import type { BadgeEvent } from "./reached-tier";

const LECTURER_BRIEFINGS = 3;

// 내가 GM으로 연 설명회 가운데 인정 세션을 종료 시각순으로 세어 LECTURER_BRIEFINGS번째 세션.
export function lecturerEvents(facts: BadgeFacts): BadgeEvent[] {
  const briefings = facts.hosted
    .filter((session) => facts.briefingIds.includes(session.gameId))
    .toSorted((left, right) => left.endsAt.getTime() - right.endsAt.getTime());
  const reached = briefings[LECTURER_BRIEFINGS - 1];
  return reached ? [{ at: reached.endsAt, gameId: reached.gameId }] : [];
}
