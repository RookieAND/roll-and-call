import { dayjs } from "./dayjs";

// 사용자 로컬 타임존 기준이라 클라이언트에서만 호출한다. 서버는 ddayKst.
export function dday(target: Date | string, now: Date = new Date()): number {
  return dayjs(new Date(target)).startOf("day").diff(dayjs(now).startOf("day"), "day");
}
