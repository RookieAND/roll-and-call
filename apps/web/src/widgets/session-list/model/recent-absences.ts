import { absenceExpiresAt } from "@/entities/game";

import type { SessionGame } from "./session-card-model";

export type Absence = { gameId: string; title: string; sessionAt: Date; expiresAt: Date };

// 3개월이 지난 기록은 없는 것과 같다. 가장 최근 것이 앞에 온다.
export function recentAbsences(
  joined: SessionGame[],
  userId: string,
  now: Date = new Date(),
): Absence[] {
  return joined
    .filter(
      (game) =>
        game.attendanceConfirmedAt !== null &&
        game.confirmedAt !== null &&
        game.participants.some(
          (participant) => participant.userId === userId && participant.absent,
        ),
    )
    .map((game) => ({
      gameId: game.id,
      title: game.title,
      sessionAt: new Date(game.confirmedAt!),
      expiresAt: absenceExpiresAt(game.confirmedAt!),
    }))
    .filter((absence) => absence.expiresAt.getTime() > now.getTime())
    .toSorted((left, right) => right.sessionAt.getTime() - left.sessionAt.getTime());
}
