import { addDays } from "./add-days";
import { toKstDateInput } from "./to-kst-date-input";

export const COORDINATION_DAYS = 14;

export function coordinationRange(now: Date = new Date()): {
  rangeStart: string;
  rangeEnd: string;
} {
  const rangeStart = toKstDateInput(now);
  return { rangeStart, rangeEnd: addDays({ date: rangeStart, count: COORDINATION_DAYS }) };
}
