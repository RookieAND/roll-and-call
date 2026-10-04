import { kstDateParts } from "./kst-date-parts";

export function formatMonthDay(value: string) {
  const { month, day } = kstDateParts(value);
  return `${month}월 ${day}일`;
}
