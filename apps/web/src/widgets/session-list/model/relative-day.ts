export function relativeDay(days: number): string | null {
  if (days < 0) return null;
  if (days === 0) return "오늘";
  if (days === 1) return "내일";
  if (days === 2) return "모레";
  return `D-${days}`;
}
