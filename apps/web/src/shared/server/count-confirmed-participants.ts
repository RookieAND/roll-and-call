export function countConfirmedParticipants(participants: { status: string }[]): number {
  return participants.filter((participant) => participant.status === "confirmed").length;
}
