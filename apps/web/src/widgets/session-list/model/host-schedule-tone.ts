import { SESSION_TONE, type SessionTone } from "./session-card-model";

export function hostScheduleTone({
  gmTodo,
  timeSet,
}: {
  gmTodo: boolean;
  timeSet: boolean;
}): SessionTone {
  if (gmTodo) return SESSION_TONE.danger;
  if (timeSet) return SESSION_TONE.strong;
  return SESSION_TONE.muted;
}
