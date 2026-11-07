import type { DayColumn, TimeRow } from "@/shared/lib";

import { AVAILABILITY_CHANGE, type AvailabilityChangeKind } from "./availability-change";
import { dayRangesText } from "./day-ranges-text";

// 저장한 칸과 지금 칠한 칸의 차이를 날짜마다 추가 → 지움 순으로 늘어놓는다.
export function availabilityChanges({
  days,
  timeRows,
  selected,
  saved,
}: {
  days: DayColumn[];
  timeRows: TimeRow[];
  selected: ReadonlySet<string>;
  saved: ReadonlySet<string>;
}): { kind: AvailabilityChangeKind; day: DayColumn; ranges: string }[] {
  return days.flatMap((day) =>
    [
      {
        kind: AVAILABILITY_CHANGE.added,
        day,
        ranges: dayRangesText({
          date: day.date,
          timeRows,
          isIncluded: (key) => selected.has(key) && !saved.has(key),
        }),
      },
      {
        kind: AVAILABILITY_CHANGE.removed,
        day,
        ranges: dayRangesText({
          date: day.date,
          timeRows,
          isIncluded: (key) => saved.has(key) && !selected.has(key),
        }),
      },
    ].filter((change) => change.ranges !== ""),
  );
}
