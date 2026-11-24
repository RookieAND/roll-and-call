import type { Dayjs } from "dayjs";
import { range } from "es-toolkit";

import { DATE_KEY_FORMAT } from "./date-key-format";

const WEEK_LENGTH = 7;

export type MonthCell = ReturnType<typeof buildMonthCells>[number];

export function buildMonthCells(monthStart: Dayjs) {
  const leadingDays = monthStart.day();
  const weekCount = Math.ceil((leadingDays + monthStart.daysInMonth()) / WEEK_LENGTH);
  const gridStart = monthStart.subtract(leadingDays, "day");

  return range(weekCount * WEEK_LENGTH).map((index) => {
    const day = gridStart.add(index, "day");
    return {
      key: day.format(DATE_KEY_FORMAT),
      label: day.format("M월 D일"),
      day: day.date(),
      weekday: day.day(),
      inMonth: day.month() === monthStart.month(),
    };
  });
}
