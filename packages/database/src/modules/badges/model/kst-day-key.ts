const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

// 한국 시각 기준 "2026-09-20". 더블 헤더가 같은 날을 가른다.
export function kstDayKey(date: Date): string {
  return new Date(date.getTime() + KST_OFFSET_MS).toISOString().slice(0, 10);
}
