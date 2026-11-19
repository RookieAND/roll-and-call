import { isNil } from "es-toolkit";

import { PARTICIPANT_STATUS } from "#db/modules/games/model";

import { BADGE_ROLE } from "./badge-ladder";
import type { MonthlyAppearance } from "./monthly-winners";
import type { MultiRoundGame } from "./multi-round-record-games";
import { ABSENCE_POINTS } from "./ranking-points";
// "불참으로 내보내기"는 구인 전체에서 한 번만 감점한다(PL·GM 모두). 포인트제에서만 센다.
export function multiRoundAbsences({
  rounds,
  participants,
}: Pick<MultiRoundGame, "rounds" | "participants">): MonthlyAppearance[] {
  const firstStart = new Date(Math.min(...rounds.map((round) => round.startAt.getTime())));
  return participants
    .filter(
      (participant) =>
        participant.status === PARTICIPANT_STATUS.removed &&
        participant.leftReason === "removed" &&
        participant.absent &&
        isNil(participant.absenceCancelledAt),
    )
    .flatMap((participant) =>
      [BADGE_ROLE.gm, BADGE_ROLE.player].map((role) => ({
        userId: participant.userId,
        role,
        startsAt: participant.absenceAt ?? firstStart,
        weight: ABSENCE_POINTS,
        sessions: 0,
      })),
    );
}
