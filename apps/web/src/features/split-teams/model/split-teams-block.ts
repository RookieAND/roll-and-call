import { difference, intersection } from "es-toolkit";

import { isCapacityMatched } from "./is-capacity-matched";
import { SPLIT_TEAMS_MESSAGE } from "./split-teams-rules";

// 새 구인에 참여시킬 사람(중복 없음)을 고른 그대로 받을 수 있는지. 받을 수 있으면 null이다.
// 고를 수 있는 사람은 원 구인의 대기 행(판정 전에는 신청자)뿐이고, 정지되었거나 서버를 떠난 사람은 뺀다.
export function splitTeamsBlock({
  userIds,
  capacity,
  waitingIds,
  excludedIds,
}: {
  userIds: readonly string[];
  capacity: number;
  waitingIds: readonly string[];
  excludedIds: readonly string[];
}): string | null {
  if (!isCapacityMatched({ capacity, selectedCount: userIds.length })) {
    return SPLIT_TEAMS_MESSAGE.capacityMismatch;
  }
  if (difference([...userIds], [...waitingIds]).length > 0) return SPLIT_TEAMS_MESSAGE.notWaiting;
  if (intersection([...userIds], [...excludedIds]).length > 0) return SPLIT_TEAMS_MESSAGE.excluded;
  return null;
}
