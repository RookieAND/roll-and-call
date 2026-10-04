import { addDays, slotIso } from "@/shared/lib";

import { DAY_MINUTES, type SessionStart } from "./session-start";

export function sessionStartIso({ date, minutes }: SessionStart): string {
  const minuteOfDay = minutes % DAY_MINUTES;
  return slotIso({
    date: addDays({ date, count: Math.floor(minutes / DAY_MINUTES) }),
    hour: Math.floor(minuteOfDay / 60),
    minute: minuteOfDay % 60,
  });
}
