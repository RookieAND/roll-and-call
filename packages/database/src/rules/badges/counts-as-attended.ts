export function countsAsAttended(participant: {
  status: string;
  absent: boolean;
  absenceCancelledAt: Date | string | null;
}): boolean {
  if (participant.status !== "confirmed") return false;
  return !participant.absent || participant.absenceCancelledAt !== null;
}
