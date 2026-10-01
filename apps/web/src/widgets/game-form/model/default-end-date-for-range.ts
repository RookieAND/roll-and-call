import { addDays } from "@/shared/lib";

export function defaultEndDateForRange(rangeStart: string): string {
  return `${addDays({ date: rangeStart, count: -1 })}T19:00`;
}
