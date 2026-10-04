import type { AvailabilityInterval } from "@roll-and-call/database";

import { addDays } from "./add-days";
import type { DayColumn } from "./build-day-columns";
import type { TimeRow } from "./build-time-rows";
import { dayjs } from "./dayjs";
import { rowSlotIso } from "./row-slot-iso";

// 서버 시드가 쓴다. 칸의 실제 날짜(자정 뒤 줄은 다음 날) 요일로 기본 가능 시간을 칠한다. 요일은 월요일이 0이다.
export function availabilityPrefill({
  intervals,
  days,
  timeRows,
}: {
  intervals: readonly AvailabilityInterval[];
  days: DayColumn[];
  timeRows: TimeRow[];
}): string[] {
  const slots = new Set<string>();
  for (const day of days) {
    for (const row of timeRows) {
      const date = addDays({ date: day.date, count: row.dayOffset });
      const weekday = (dayjs.utc(date).day() + 6) % 7;
      const covered = intervals.some(
        (interval) =>
          interval.day === weekday && interval.from <= row.hour && row.hour < interval.to,
      );
      if (covered) slots.add(rowSlotIso({ date: day.date, row }));
    }
  }
  return [...slots];
}
