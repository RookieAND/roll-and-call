import type { DayColumn } from "@/shared/lib";

// 월요일 시작 주 단위: 토·일이 한 주에 묶여 주말 세션을 한 화면에서 고른다.
export function groupDaysByWeek(days: DayColumn[]): DayColumn[][] {
  const weeks: DayColumn[][] = [];
  for (const day of days) {
    const current = weeks.at(-1);
    if (!current || day.dow === "월") weeks.push([day]);
    else current.push(day);
  }
  return weeks;
}
