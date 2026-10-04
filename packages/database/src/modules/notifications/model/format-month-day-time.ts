import { kstDateParts } from "./kst-date-parts";

export function formatMonthDayTime(value: string) {
  const { month, day, time } = kstDateParts(value);
  return `${month}월 ${day}일 ${time}`;
}
