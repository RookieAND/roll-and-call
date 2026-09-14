import type { DayColumn } from "@/shared/lib";

// 조율 기간을 월요일 시작 주 단위로 자른다. 토·일이 한 주에 묶여 주말 세션을 한 화면에서 고른다.
export function groupDaysByWeek(days: DayColumn[]): DayColumn[][] {
  const weeks: DayColumn[][] = [];
  for (const day of days) {
    const current = weeks.at(-1);
    if (!current || day.dow === "월") weeks.push([day]);
    else current.push(day);
  }
  return weeks;
}

// date(YYYY-MM-DD, KST)가 속한 주. 없으면 첫 주.
export function weekIndexOf(weeks: DayColumn[][], date: string | null): number {
  if (!date) return 0;
  const index = weeks.findIndex((week) => week.some((day) => day.date === date));
  return Math.max(index, 0);
}
