export type ParticipantStatus = "confirmed" | "waiting";

export const PARTICIPANT_STATUS = {
  confirmed: "confirmed",
  waiting: "waiting",
} as const satisfies Record<ParticipantStatus, ParticipantStatus>;

export function countConfirmed(participants: { status: ParticipantStatus }[]): number {
  return participants.filter((participant) => participant.status === PARTICIPANT_STATUS.confirmed)
    .length;
}
