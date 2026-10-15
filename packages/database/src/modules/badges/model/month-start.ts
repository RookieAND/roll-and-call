import { KST_OFFSET_MS } from "#/modules/games/model/kst-offset";

// "2026-09" → 2026-09-01 00:00 KST.
export function monthStart(monthKey: string): Date {
  const [year, month] = monthKey.split("-").map(Number) as [number, number];
  return new Date(Date.UTC(year, month - 1, 1) - KST_OFFSET_MS);
}
