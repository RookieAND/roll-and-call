import { dayjs } from "@roll-and-call/app-kit/date";
import type { AvailabilityInterval } from "@roll-and-call/database";

import { addDays, rowSlotIso, type DayColumn, type TimeRow } from "@/shared/lib";

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
