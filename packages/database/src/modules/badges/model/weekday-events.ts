import type { BadgeFacts } from "./badge-facts";
import { kstShifted } from "./kst-shifted";
import type { BadgeEvent } from "./reached-tier";

const WEEK_DAYS = 7;

// 인정 세션을 종료 시각 순으로 보며 시작 시각의 KST 요일 일곱 개가 모두 모인 순간. 연속일 필요 없다.
export function weekdayEvents(facts: BadgeFacts): BadgeEvent[] {
  const seen = new Set<number>();
  const sessions = [...facts.played, ...facts.hosted].toSorted(
    (left, right) => left.endsAt.getTime() - right.endsAt.getTime(),
  );
  for (const session of sessions) {
    seen.add(kstShifted(session.startsAt).getUTCDay());
    if (seen.size === WEEK_DAYS) return [{ at: session.endsAt, gameId: session.gameId }];
  }
  return [];
}
