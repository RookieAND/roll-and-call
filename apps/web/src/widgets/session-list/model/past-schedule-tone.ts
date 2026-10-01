import { SESSION_TONE, type SessionTone } from "./session-card-model";

export function pastScheduleTone({
  absent,
  attendancePending,
}: {
  absent: boolean;
  attendancePending: boolean;
}): SessionTone {
  if (absent) return SESSION_TONE.danger;
  if (attendancePending) return SESSION_TONE.warning;
  return SESSION_TONE.muted;
}
