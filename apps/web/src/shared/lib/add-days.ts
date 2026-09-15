import { padTwoDigits } from "./pad-two-digits";

export function addDays(date: string, count: number): string {
  const day = new Date(`${date}T00:00:00Z`);
  day.setUTCDate(day.getUTCDate() + count);
  return `${day.getUTCFullYear()}-${padTwoDigits(day.getUTCMonth() + 1)}-${padTwoDigits(day.getUTCDate())}`;
}
