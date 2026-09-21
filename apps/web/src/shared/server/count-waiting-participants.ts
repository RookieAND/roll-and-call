export function countWaitingParticipants(participants: { status: string }[]): number {
  return participants.filter((participant) => participant.status === "waiting").length;
}
