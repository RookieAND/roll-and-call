import { groupBy } from "es-toolkit";

import { DATE_KEY_FORMAT, toKst } from "@/shared/lib";

import type { CalendarSession } from "./to-calendar-sessions";

export function groupSessionsByDay(sessions: CalendarSession[]) {
  return groupBy(sessions, (session) => toKst(session.startsAt).format(DATE_KEY_FORMAT));
}
