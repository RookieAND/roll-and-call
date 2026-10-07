import type { AvailabilityInterval } from "@roll-and-call/database";

import { groupByDay, type AvailabilityDay } from "./group-by-day";

export function filledDays(intervals: readonly AvailabilityInterval[]): AvailabilityDay[] {
  return groupByDay(intervals).filter((entry) => entry.intervals.length > 0);
}
