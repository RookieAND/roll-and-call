import { kstMonthKey } from "@roll-and-call/database/badges/model";

// 이달의 GM·PL은 지난달 1위가 이번 달 내내 단다.
export function previousMonthKey(now: Date): string {
  const [year, month] = kstMonthKey(now).split("-").map(Number) as [number, number];
  return month === 1 ? `${year - 1}-12` : `${year}-${String(month - 1).padStart(2, "0")}`;
}
