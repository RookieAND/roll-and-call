// month is 1-12
export function daysInMonth({ year, month }: { year: number; month: number }): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}
