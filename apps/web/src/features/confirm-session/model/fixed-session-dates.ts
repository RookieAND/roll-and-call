import { addDays, buildDayColumns, toKst, type DayColumn } from "@/shared/lib";

const DIMMED_DAYS_BEFORE_DEADLINE = 7;
const SELECTABLE_DAYS = 60;
const DATE_FORMAT = "YYYY-MM-DD";

export type FixedSessionDate = DayColumn & { disabled: boolean };

// 오늘이나 마감 7일 전 중 늦은 날부터 60일. 마감 날짜 앞 날은 흐리게 두고 고를 수 없다.
export function fixedSessionDates({
  endDate,
  now,
}: {
  endDate: Date;
  now: Date;
}): FixedSessionDate[] {
  const deadlineDate = toKst(endDate).format(DATE_FORMAT);
  const today = toKst(now).format(DATE_FORMAT);
  const dimmedStart = addDays({ date: deadlineDate, count: -DIMMED_DAYS_BEFORE_DEADLINE });
  const rangeStart = dimmedStart > today ? dimmedStart : today;
  const columns = buildDayColumns({
    rangeStart,
    rangeEnd: addDays({ date: rangeStart, count: SELECTABLE_DAYS - 1 }),
  });
  return columns.map((column) => ({
    ...column,
    disabled: column.date < deadlineDate || column.date < today,
  }));
}
