export type ParticipantStatus = "confirmed" | "waiting";

export const PARTICIPANT_STATUS = {
  confirmed: "confirmed",
  waiting: "waiting",
} as const satisfies Record<ParticipantStatus, ParticipantStatus>;
