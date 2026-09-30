// 확정 참여자 가운데 불참이 아닌 사람. 운영진이 불참을 취소하면 다시 참석으로 센다.
export function countsAsAttended(participant: {
  status: string;
  absent: boolean;
  absenceCancelledAt: Date | string | null;
}): boolean {
  if (participant.status !== "confirmed") return false;
  return !participant.absent || participant.absenceCancelledAt !== null;
}
