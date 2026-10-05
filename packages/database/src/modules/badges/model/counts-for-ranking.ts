import { PARTICIPANT_STATUS } from "#/modules/games/model/participant-status";

import { countsAsAttended } from "./counts-as-attended";
import { isTieSession } from "./is-tie-session";
import type { RecordGame } from "./record-session";

// 순위(이 달의 기록 GM·PL, 이달의 GM·PL 뱃지, 월간 발표, 도감·마이페이지 1위 횟수)에서 뺄 세션을 판정하는 유일한 곳. 타이만(1:1)을 뺀다. 세션 건수에는 쓰지 않는다.
export function countsForRanking(game: RecordGame): boolean {
  const attendedCount = game.participants.filter(
    (participant) =>
      participant.status === PARTICIPANT_STATUS.confirmed && countsAsAttended(participant),
  ).length;
  return !isTieSession(attendedCount);
}
