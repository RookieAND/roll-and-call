import { groupBy } from "es-toolkit";

import type { BadgeFacts, BadgeSession } from "./badge-facts";
import { kstDayKey } from "./kst-day-key";
import type { BadgeEvent } from "./reached-tier";

const byEnd = (left: BadgeSession, right: BadgeSession) =>
  left.endsAt.getTime() - right.endsAt.getTime();

// 같은 날(시작 시각의 KST 날짜) 두 번째 세션이 근거다. GM·PL은 가리지 않는다.
export function doubleHeaderEvents(facts: BadgeFacts): BadgeEvent[] {
  const byDay = groupBy([...facts.played, ...facts.hosted], (session) =>
    kstDayKey(session.startsAt),
  );
  return Object.values(byDay)
    .filter((sessions) => sessions.length >= 2)
    .map((sessions) => sessions.toSorted(byEnd)[1]!)
    .toSorted(byEnd)
    .slice(0, 1)
    .map((session) => ({ at: session.endsAt, gameId: session.gameId }));
}
