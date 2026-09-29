import { PARTICIPANT_STATUS, type ParticipantStatus } from "./participant-status";

export function countWaiting(participants: { status: ParticipantStatus }[]): number {
  return participants.filter((participant) => participant.status === PARTICIPANT_STATUS.waiting)
    .length;
}
