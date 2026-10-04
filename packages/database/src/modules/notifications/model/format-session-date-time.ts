import { kstDateParts } from "./kst-date-parts";

export function formatSessionDateTime(value: string) {
  const { month, day, weekday, time } = kstDateParts(value);
  return `${month}월 ${day}일 (${weekday}) ${time}`;
}
