const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

// 한국 시각 기준 "2026-09". 이 달의 기록과 같은 달 경계를 쓴다.
export function kstMonthKey(date: Date): string {
  const kst = new Date(date.getTime() + KST_OFFSET_MS);
  return `${kst.getUTCFullYear()}-${String(kst.getUTCMonth() + 1).padStart(2, "0")}`;
}
