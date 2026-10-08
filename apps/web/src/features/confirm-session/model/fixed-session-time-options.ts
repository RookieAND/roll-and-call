import { range } from "es-toolkit";

import { padTwoDigits, SLOT_MINUTES } from "@/shared/lib";

const DAY_SLOTS = (24 * 60) / SLOT_MINUTES;

export const FIXED_SESSION_TIME_OPTIONS = range(DAY_SLOTS).map((index) => {
  const minutes = index * SLOT_MINUTES;
  return {
    value: String(minutes),
    label: `${padTwoDigits(Math.floor(minutes / 60))}:${padTwoDigits(minutes % 60)}`,
  };
});
