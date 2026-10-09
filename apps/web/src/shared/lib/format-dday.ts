export function formatDday(days: number): string {
  return days > 0 ? `D-${days}` : "D-day";
}
