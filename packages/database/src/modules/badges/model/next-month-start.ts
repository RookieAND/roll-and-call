import { KST_OFFSET_MS } from "#/modules/games/model/kst-offset";

// "2026-09" → 2026-10-01 00:00 KST. 이달의 뱃지가 붙는 시각이다.
export function nextMonthStart(monthKey: string): Date {
  const [year, month] = monthKey.split("-").map(Number) as [number, number];
  return new Date(Date.UTC(year, month, 1) - KST_OFFSET_MS);
}
