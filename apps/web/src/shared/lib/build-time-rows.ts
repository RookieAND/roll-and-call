import { padTwoDigits } from "./pad-two-digits";
import { DAY_END_HOUR, DAY_START_HOUR, SLOT_MINUTES } from "./slot-window";

export type TimeRow = { hour: number; minute: number; label: string };

export function buildTimeRows(): TimeRow[] {
  const rows: TimeRow[] = [];
  for (let hour = DAY_START_HOUR; hour < DAY_END_HOUR; hour++) {
    for (let minute = 0; minute < 60; minute += SLOT_MINUTES) {
      rows.push({ hour, minute, label: `${padTwoDigits(hour)}:${padTwoDigits(minute)}` });
    }
  }
  return rows;
}
