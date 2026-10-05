const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

// 한국 시각을 UTC 필드로 읽도록 9시간 민 시각. getUTCHours·getUTCDay가 KST 시·요일이 된다.
export function kstShifted(date: Date): Date {
  return new Date(date.getTime() + KST_OFFSET_MS);
}
