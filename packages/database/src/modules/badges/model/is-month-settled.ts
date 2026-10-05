import { nextMonthStart } from "./next-month-start";

const SETTLE_DAYS = 1;
const DAY_MS = 24 * 60 * 60 * 1000;

// 달이 끝나고 하루가 지나면 그 달 1위를 굳힌다. 출석은 세션이 끝난 뒤 24시간 안에 정해지므로 하루가 버퍼다.
export function isMonthSettled(monthKey: string, now: Date): boolean {
  return now.getTime() >= nextMonthStart(monthKey).getTime() + SETTLE_DAYS * DAY_MS;
}
