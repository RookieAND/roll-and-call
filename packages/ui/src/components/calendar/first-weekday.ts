export function firstWeekday({ year, month }: { year: number; month: number }): number {
  return new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
}
