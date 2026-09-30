import { nextMonthStart } from "./next-month-start";

const SETTLE_DAYS = 7;
const DAY_MS = 24 * 60 * 60 * 1000;

// 달이 끝나고 7일이 지나면 그 달 1위를 굳힌다. 늦게 끝난 출석 확인은 이 안에서만 순위를 바꾼다.
export function isMonthSettled(monthKey: string, now: Date): boolean {
  return now.getTime() >= nextMonthStart(monthKey).getTime() + SETTLE_DAYS * DAY_MS;
}
