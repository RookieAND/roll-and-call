import { groupBy } from "es-toolkit";

import type { BadgeFacts, BadgeSession } from "./badge-facts";
import { kstMonthKey } from "./kst-month-key";
import type { BadgeEvent } from "./reached-tier";

const byEnd = (left: BadgeSession, right: BadgeSession) =>
  left.endsAt.getTime() - right.endsAt.getTime();

// 같은 달에 GM과 PL을 모두 한 첫 달. 그 달의 첫 운영과 첫 참여 가운데 늦은 쪽이 근거다.
export function ambidextrousEvents(facts: BadgeFacts): BadgeEvent[] {
  const hostedByMonth = groupBy(facts.hosted, (session) => kstMonthKey(session.startsAt));
  const playedByMonth = groupBy(facts.played, (session) => kstMonthKey(session.startsAt));
  return Object.keys(hostedByMonth)
    .filter((month) => playedByMonth[month])
    .map((month) => {
      const hosted = hostedByMonth[month]!.toSorted(byEnd)[0]!;
      const played = playedByMonth[month]!.toSorted(byEnd)[0]!;
      return byEnd(hosted, played) > 0 ? hosted : played;
    })
    .toSorted(byEnd)
    .slice(0, 1)
    .map((session) => ({ at: session.endsAt, gameId: session.gameId }));
}
