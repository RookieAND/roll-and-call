import { padTwoDigits } from "./pad-two-digits";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];
const MAX_COLUMNS = 60;

export type DayColumn = { date: string; label: string; dow: string; md: string };

export function buildDayColumns(rangeStart: string, rangeEnd: string): DayColumn[] {
  const [startYear, startMonth, startDay] = rangeStart.split("-").map(Number);
  const [endYear, endMonth, endDay] = rangeEnd.split("-").map(Number);
  const current = new Date(Date.UTC(startYear!, startMonth! - 1, startDay!));
  const last = new Date(Date.UTC(endYear!, endMonth! - 1, endDay!));
  const columns: DayColumn[] = [];
  while (current.getTime() <= last.getTime()) {
    const month = current.getUTCMonth() + 1;
    const day = current.getUTCDate();
    const weekday = WEEKDAYS[current.getUTCDay()]!;
    const monthDay = `${month}/${day}`;
    columns.push({
      date: `${current.getUTCFullYear()}-${padTwoDigits(month)}-${padTwoDigits(day)}`,
      label: `${monthDay}(${weekday})`,
      dow: weekday,
      md: monthDay,
    });
    current.setUTCDate(current.getUTCDate() + 1);
    if (columns.length > MAX_COLUMNS) break;
  }
  return columns;
}
