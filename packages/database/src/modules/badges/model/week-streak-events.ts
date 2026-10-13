import { groupBy } from "es-toolkit";

import type { BadgeSession } from "./badge-facts";
import { kstShifted } from "./kst-shifted";
import type { BadgeEvent } from "./reached-tier";

const DAY_MS = 24 * 60 * 60 * 1000;
// 1970-01-01(목)이 0일이라 3을 더하면 월요일이 주의 시작이 된다.
const MONDAY_OFFSET_DAYS = 3;
const WEEK_DAYS = 7;

const weekNumber = (date: Date) =>
  Math.floor((kstShifted(date).getTime() / DAY_MS + MONDAY_OFFSET_DAYS) / WEEK_DAYS);

// 인정 세션이 있는 KST 주(월~일)가 달력으로 length주 이어지면 받는다. 한 주에 여러 세션은 1주다.
// 사건은 처음 length주째에 닿은 주의 세션 가운데 가장 이른 종료 시각.
export function weekStreakEvents({
  sessions,
  length,
}: {
  sessions: BadgeSession[];
  length: number;
}): BadgeEvent[] {
  const byWeek = groupBy(sessions, (session) => String(weekNumber(session.startsAt)));
  const weeks = Object.keys(byWeek)
    .map(Number)
    .toSorted((left, right) => left - right);
  let run = 0;
  let previous: number | null = null;
  for (const week of weeks) {
    run = previous !== null && week - previous === 1 ? run + 1 : 1;
    previous = week;
    if (run === length) {
      const first = byWeek[String(week)]!.toSorted(
        (left, right) => left.endsAt.getTime() - right.endsAt.getTime(),
      )[0]!;
      return [{ at: first.endsAt, gameId: first.gameId }];
    }
  }
  return [];
}
