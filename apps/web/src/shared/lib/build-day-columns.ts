import { dayjs } from "./dayjs";

const MAX_COLUMNS = 60;

export type DayColumn = { date: string; label: string; dow: string; md: string };

export function buildDayColumns(rangeStart: string, rangeEnd: string): DayColumn[] {
  const last = dayjs.utc(rangeEnd);
  const columns: DayColumn[] = [];
  for (
    let day = dayjs.utc(rangeStart);
    !day.isAfter(last) && columns.length <= MAX_COLUMNS;
    day = day.add(1, "day")
  ) {
    const weekday = day.format("dd");
    const monthDay = day.format("M/D");
    columns.push({
      date: day.format("YYYY-MM-DD"),
      label: `${monthDay}(${weekday})`,
      dow: weekday,
      md: monthDay,
    });
  }
  return columns;
}
