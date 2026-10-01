export function monthLabel(monthKey: string): string {
  return `${Number(monthKey.split("-")[1])}월`;
}
