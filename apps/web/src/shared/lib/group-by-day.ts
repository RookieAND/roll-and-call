import type { AvailabilityInterval } from "@roll-and-call/database";

import { WEEKDAY_LABELS } from "./weekday-labels";

export type AvailabilityDay = { day: number; label: string; intervals: AvailabilityInterval[] };

export function groupByDay(intervals: readonly AvailabilityInterval[]): AvailabilityDay[] {
  return WEEKDAY_LABELS.map((label, day) => ({
    day,
    label,
    intervals: intervals
      .filter((interval) => interval.day === day)
      .toSorted((left, right) => left.from - right.from),
  }));
}
