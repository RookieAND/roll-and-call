import { PARTICIPANT_STATUS, type ParticipantStatus } from "@/entities/game";

// 출석 명단: 확정자와 시작 뒤 불참으로 내보낸 사람.
export function attendanceRoster<Participant extends { status: ParticipantStatus }>(
  participants: Participant[],
): Participant[] {
  return participants.filter(
    (participant) =>
      participant.status === PARTICIPANT_STATUS.confirmed ||
      participant.status === PARTICIPANT_STATUS.removed,
  );
}
