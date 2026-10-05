import { PARTICIPANT_STATUS } from "#/modules/games/model/participant-status";

import { absencePenalty } from "./absence-penalty";
import { BADGE_ROLE } from "./badge-ladder";
import { countsAsAttended } from "./counts-as-attended";
import { hostBonus } from "./host-bonus";
import type { MonthlyAppearance } from "./monthly-appearance";
import { rankingSessionKind } from "./ranking-session-kind";
import { isRecordSession, type RecordGame } from "./record-session";
import { sessionScore } from "./session-score";

// 순위 점수 항목: 기록 세션마다 GM 한 항목(세션 점수 + 다인원 가점), 참석으로 치는 확정자 한 항목,
// 불참 확정자는 PL·GM 점수에서 각각 감점 항목. 후기 점수는 reviewAppearances가 따로 만든다.
export function recordAppearances(games: RecordGame[], now: Date): MonthlyAppearance[] {
  return games.flatMap((game) => {
    const confirmed = game.participants.filter(
      (participant) => participant.status === PARTICIPANT_STATUS.confirmed,
    );
    if (!isRecordSession({ ...game, confirmedCount: confirmed.length }, now)) return [];
    const startsAt = new Date(game.confirmedAt!);
    const attendees = confirmed.filter(countsAsAttended);
    const absentees = confirmed.filter((participant) => !countsAsAttended(participant));
    const kind = rankingSessionKind({
      confirmedAttendeeCount: attendees.length,
      rulebookMiniRule: game.rulebook?.category.miniRule ?? false,
      hasRulebook: Boolean(game.rulebook),
    });
    const score = sessionScore(kind);
    return [
      {
        userId: game.gmId,
        role: BADGE_ROLE.gm,
        startsAt,
        score: score + hostBonus({ kind, attendeePlayers: attendees.length }),
        sessions: 1,
      },
      ...attendees.map((participant) => ({
        userId: participant.userId,
        role: BADGE_ROLE.player,
        startsAt,
        score,
        sessions: 1,
      })),
      ...absentees.flatMap((participant) =>
        [BADGE_ROLE.player, BADGE_ROLE.gm].map((role) => ({
          userId: participant.userId,
          role,
          startsAt,
          score: -absencePenalty(),
          sessions: 0,
        })),
      ),
    ];
  });
}
