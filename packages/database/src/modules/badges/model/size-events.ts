import type { BadgeFacts } from "./badge-facts";
import type { BadgeEvent } from "./reached-tier";

const MEDIUM_MIN = 4;
const LARGE_MIN = 6;
const SIZE_COUNT = 3;

function sizeOf(attendedCount: number) {
  if (attendedCount >= LARGE_MIN) return "large";
  return attendedCount >= MEDIUM_MIN ? "medium" : "small";
}

// 확정 참석자(GM 제외)가 소 2~3명, 중 4~5명, 대 6명 이상인 인정 세션을 모두 한 번씩 거친 순간. GM·PL은 가리지 않는다.
export function sizeEvents(facts: BadgeFacts): BadgeEvent[] {
  const seen = new Set<string>();
  const sessions = [...facts.played, ...facts.hosted].toSorted(
    (left, right) => left.endsAt.getTime() - right.endsAt.getTime(),
  );
  for (const session of sessions) {
    seen.add(sizeOf(session.attendedCount));
    if (seen.size === SIZE_COUNT) return [{ at: session.endsAt, gameId: session.gameId }];
  }
  return [];
}
