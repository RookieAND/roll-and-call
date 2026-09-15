import { toKst } from "@/shared/lib";

import { DATE_KEY_FORMAT } from "./date-key-format";
import type { CalendarSession } from "./to-calendar-sessions";

export function groupSessionsByDay(sessions: CalendarSession[]) {
  const sessionsByDay = new Map<string, CalendarSession[]>();
  for (const session of sessions) {
    const key = toKst(session.startsAt).format(DATE_KEY_FORMAT);
    sessionsByDay.set(key, [...(sessionsByDay.get(key) ?? []), session]);
  }
  return sessionsByDay;
}
