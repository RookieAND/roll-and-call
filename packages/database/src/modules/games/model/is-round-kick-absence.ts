import { isNil } from "es-toolkit";

import { PARTICIPANT_STATUS, type ParticipantStatus } from "./participant-status";

// 다회차 구인에서 불참 기록은 GM이 불참으로 내보낸 경우뿐이다. 회차에 빠진 것은 출석 기록일 뿐 불참이 아니다.
export function isRoundKickAbsence(participant: {
  status: ParticipantStatus;
  absent: boolean;
  leftReason: string | null;
  absenceCancelledAt?: Date | string | null;
}): boolean {
  return (
    participant.absent &&
    participant.status === PARTICIPANT_STATUS.removed &&
    participant.leftReason === "removed" &&
    isNil(participant.absenceCancelledAt)
  );
}
