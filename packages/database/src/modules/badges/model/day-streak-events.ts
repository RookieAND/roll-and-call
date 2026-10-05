import { groupBy } from "es-toolkit";

import type { BadgeFacts } from "./badge-facts";
import { kstDayKey } from "./kst-day-key";
import type { BadgeEvent } from "./reached-tier";

const DAY_MS = 24 * 60 * 60 * 1000;

// 인정 세션이 있는 KST 날짜가 달력으로 length일 이어지면 받는다. 하루 여러 세션은 1일이다.
// 사건은 처음 length일째에 닿은 날 세션 가운데 가장 이른 종료 시각.
export function dayStreakEvents({
  facts,
  length,
}: {
  facts: BadgeFacts;
  length: number;
}): BadgeEvent[] {
  const byDay = groupBy([...facts.played, ...facts.hosted], (session) =>
    kstDayKey(session.startsAt),
  );
  const days = Object.keys(byDay).toSorted();
  let run = 0;
  let previous: number | null = null;
  for (const day of days) {
    const time = Date.parse(day);
    run = previous !== null && time - previous === DAY_MS ? run + 1 : 1;
    previous = time;
    if (run === length) {
      const first = byDay[day]!.toSorted(
        (left, right) => left.endsAt.getTime() - right.endsAt.getTime(),
      )[0]!;
      return [{ at: first.endsAt, gameId: first.gameId }];
    }
  }
  return [];
}
