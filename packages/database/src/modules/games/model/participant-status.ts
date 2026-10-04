export type ParticipantStatus = "confirmed" | "waiting" | "removed";

export const PARTICIPANT_STATUS = {
  confirmed: "confirmed",
  waiting: "waiting",
  removed: "removed",
} as const satisfies Record<ParticipantStatus, ParticipantStatus>;
