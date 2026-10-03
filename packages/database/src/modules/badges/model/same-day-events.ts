import { groupBy } from "es-toolkit";

import type { BadgeFacts, BadgeSession } from "./badge-facts";
import { kstDayKey } from "./kst-day-key";
import type { BadgeEvent } from "./reached-tier";

const byEnd = (left: BadgeSession, right: BadgeSession) =>
  left.endsAt.getTime() - right.endsAt.getTime();

// 같은 날(시작 시각의 KST 날짜) count번째 세션이 근거다. GM·PL은 가리지 않는다.
export function sameDayEvents({
  facts,
  count,
}: {
  facts: BadgeFacts;
  count: number;
}): BadgeEvent[] {
  const byDay = groupBy([...facts.played, ...facts.hosted], (session) =>
    kstDayKey(session.startsAt),
  );
  return Object.values(byDay)
    .filter((sessions) => sessions.length >= count)
    .map((sessions) => sessions.toSorted(byEnd)[count - 1]!)
    .toSorted(byEnd)
    .slice(0, 1)
    .map((session) => ({ at: session.endsAt, gameId: session.gameId }));
}
