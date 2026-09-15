import type { DayColumn } from "@/shared/lib";

export function weekIndexOf(weeks: DayColumn[][], date: string | null): number {
  if (!date) return 0;
  const index = weeks.findIndex((week) => week.some((day) => day.date === date));
  return Math.max(index, 0);
}
