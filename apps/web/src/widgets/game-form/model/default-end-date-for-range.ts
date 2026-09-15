import { addDays } from "@/shared/lib";

export function defaultEndDateForRange(rangeStart: string): string {
  return `${addDays(rangeStart, -1)}T19:00`;
}
