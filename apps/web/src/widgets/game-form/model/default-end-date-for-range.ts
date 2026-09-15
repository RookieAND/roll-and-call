import { previousDay } from "./previous-day";

export function defaultEndDateForRange(rangeStart: string): string {
  return `${previousDay(rangeStart)}T19:00`;
}
