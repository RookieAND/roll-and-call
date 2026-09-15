import { dayjs } from "./dayjs";

// 타임존과 무관하게 달력 날짜로만 센다.
export function addDays(date: string, count: number): string {
  return dayjs.utc(date).add(count, "day").format("YYYY-MM-DD");
}
