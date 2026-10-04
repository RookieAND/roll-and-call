import type { AvailabilityInterval } from "@roll-and-call/database";

import type { DayColumn } from "./build-day-columns";
import type { TimeRow } from "./build-time-rows";
import { filledDays } from "./filled-days";
import { slotIso } from "./slot-iso";
import { WEEKDAY_LABELS } from "./weekday-labels";

export function availabilityPrefill({
  intervals,
  days,
  timeRows,
}: {
  intervals: readonly AvailabilityInterval[];
  days: DayColumn[];
  timeRows: TimeRow[];
}): { keys: string[]; label: string } | null {
  if (intervals.length === 0) return null;
  const slots = new Set<string>();
  for (const day of days) {
    const index = WEEKDAY_LABELS.indexOf(day.dow as (typeof WEEKDAY_LABELS)[number]);
    if (index < 0) continue;
    for (const interval of intervals) {
      if (interval.day !== index) continue;
      for (const row of timeRows) {
        if (row.hour >= interval.from && row.hour < interval.to) {
          slots.add(slotIso({ date: day.date, hour: row.hour, minute: row.minute }));
        }
      }
    }
  }
  if (slots.size === 0) return null;
  return {
    keys: [...slots],
    label: filledDays(intervals)
      .map((entry) => entry.label)
      .join("·"),
  };
}
