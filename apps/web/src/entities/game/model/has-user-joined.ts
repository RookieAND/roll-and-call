import { isNull } from "es-toolkit";

import { PARTICIPANT_STATUS, type ParticipantStatus } from "./participant";

// 확정 또는 대기일 때만 참여 중이다. 불참으로 내보낸 사람(removed)은 참여 중이 아니다.
export function hasUserJoined({
  participants,
  userId,
}: {
  participants: { userId: string; status: ParticipantStatus }[];
  userId: string | null;
}): boolean {
  return (
    !isNull(userId) &&
    participants.some(
      (participant) =>
        participant.userId === userId && participant.status !== PARTICIPANT_STATUS.removed,
    )
  );
}
