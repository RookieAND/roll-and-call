import { groupBy } from "es-toolkit";

import { toKst } from "@/shared/lib";

import { DATE_KEY_FORMAT } from "./date-key-format";
import type { CalendarSession } from "./to-calendar-sessions";

export function groupSessionsByDay(sessions: CalendarSession[]) {
  return groupBy(sessions, (session) => toKst(session.startsAt).format(DATE_KEY_FORMAT));
}
