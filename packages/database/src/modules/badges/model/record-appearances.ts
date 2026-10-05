import { PARTICIPANT_STATUS } from "#/modules/games/model/participant-status";

import { BADGE_ROLE } from "./badge-ladder";
import { countsAsAttended } from "./counts-as-attended";
import { countsForRanking } from "./counts-for-ranking";
import type { MonthlyAppearance } from "./monthly-winners";
import { isRecordSession, type RecordGame } from "./record-session";

// 순위에 들어가는 출연: 기록 세션마다 GM 한 번, 참석으로 치는 확정자 한 번씩.
export function recordAppearances(games: RecordGame[], now: Date): MonthlyAppearance[] {
  return games.flatMap((game) => {
    const confirmedCount = game.participants.filter(
      (participant) => participant.status === PARTICIPANT_STATUS.confirmed,
    ).length;
    if (!isRecordSession({ ...game, confirmedCount }, now) || !countsForRanking(game)) return [];
    const startsAt = new Date(game.confirmedAt!);
    return [
      { userId: game.gmId, role: BADGE_ROLE.gm, startsAt, weight: 1 },
      ...game.participants.filter(countsAsAttended).map((participant) => ({
        userId: participant.userId,
        role: BADGE_ROLE.player,
        startsAt,
        weight: 1,
      })),
    ];
  });
}
