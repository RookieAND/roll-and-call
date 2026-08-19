export type ParticipantStatus = "confirmed" | "waiting";

export const PARTICIPANT_STATUS = {
  confirmed: "confirmed",
  waiting: "waiting",
} as const satisfies Record<ParticipantStatus, ParticipantStatus>;

// 정원(seat) 계산은 확정 참여자만 센다. 대기자는 포함하지 않는다.
export function countConfirmed(participants: { status: ParticipantStatus }[]): number {
  return participants.filter((p) => p.status === PARTICIPANT_STATUS.confirmed).length;
}
