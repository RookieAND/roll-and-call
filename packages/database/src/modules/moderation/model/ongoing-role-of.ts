import {
  PARTICIPANT_STATUS,
  type ParticipantStatus,
} from "#/modules/games/model/participant-status";

import { ONGOING_ROLE, type OngoingRole } from "./ongoing-role";

// 내보낸(removed) 참여나 관계없는 구인이면 null이다.
export function ongoingRoleOf({
  hosted,
  status,
}: {
  hosted: boolean;
  status: ParticipantStatus | undefined;
}): OngoingRole | null {
  if (hosted) return ONGOING_ROLE.gm;
  if (status === PARTICIPANT_STATUS.confirmed) return ONGOING_ROLE.confirmed;
  if (status === PARTICIPANT_STATUS.waiting) return ONGOING_ROLE.waiting;
  return null;
}
