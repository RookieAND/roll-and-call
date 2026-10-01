import { SESSION_ICON, type SessionIcon } from "./session-card-model";

export function hostScheduleIcon({
  gmTodo,
  timeSet,
}: {
  gmTodo: boolean;
  timeSet: boolean;
}): SessionIcon {
  if (gmTodo) return SESSION_ICON.alert;
  if (timeSet) return SESSION_ICON.calendar;
  return SESSION_ICON.clock;
}
