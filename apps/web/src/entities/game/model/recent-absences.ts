import {
  absenceExpiresAt,
  isAbsenceActive,
  isRoundKickAbsence,
} from "@roll-and-call/database/games/model";
import { isNull } from "es-toolkit";

import type { SessionGame } from "./session-game";

export type Absence = { gameId: string; title: string; sessionAt: Date; expiresAt: Date };

export function recentAbsences({
  joined,
  userId,
  now = new Date(),
}: {
  joined: SessionGame[];
  userId: string;
  now?: Date;
}): Absence[] {
  return joined
    .flatMap((game) => {
      const mine = game.participants.find((participant) => participant.userId === userId);
      if (!mine) return [];
      // 다회차는 불참으로 내보낸 회차의 시작부터 센다. 출석 확정은 기다리지 않는다.
      const multiRound = game.roundCount > 1;
      const startsAt = multiRound ? (mine.absenceAt ?? game.confirmedAt) : game.confirmedAt;
      const counted = multiRound
        ? isRoundKickAbsence({ ...mine, leftReason: mine.leftReason ?? null })
        : !isNull(game.attendanceConfirmedAt) && mine.absent;
      if (!counted || !startsAt) return [];
      return [
        {
          gameId: game.id,
          title: game.title,
          sessionAt: new Date(startsAt),
          expiresAt: absenceExpiresAt(startsAt),
        },
      ];
    })
    .filter((absence) => isAbsenceActive({ sessionStartsAt: absence.sessionAt, now }))
    .toSorted((left, right) => right.sessionAt.getTime() - left.sessionAt.getTime());
}
