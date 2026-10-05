import type { BadgeFacts } from "./badge-facts";
import { kstShifted } from "./kst-shifted";
import type { BadgeEvent } from "./reached-tier";

const SLOT_HOURS = 6;
const SLOT_COUNT = 4;

// 시작 시각이 새벽(0~5시)·오전(6~11시)·오후(12~17시)·저녁(18~23시)인 인정 세션을 모두 한 번씩 거친 순간. GM·PL은 가리지 않는다.
export function timeSlotEvents(facts: BadgeFacts): BadgeEvent[] {
  const seen = new Set<number>();
  const sessions = [...facts.played, ...facts.hosted].toSorted(
    (left, right) => left.endsAt.getTime() - right.endsAt.getTime(),
  );
  for (const session of sessions) {
    seen.add(Math.floor(kstShifted(session.startsAt).getUTCHours() / SLOT_HOURS));
    if (seen.size === SLOT_COUNT) return [{ at: session.endsAt, gameId: session.gameId }];
  }
  return [];
}
