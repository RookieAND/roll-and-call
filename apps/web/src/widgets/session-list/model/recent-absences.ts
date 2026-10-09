import { isNull } from "es-toolkit";

import { absenceExpiresAt, isAbsenceActive } from "@/entities/game";

import type { SessionGame } from "./session-card-model";

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
    .filter(
      (game) =>
        !isNull(game.attendanceConfirmedAt) &&
        game.participants.some(
          (participant) => participant.userId === userId && participant.absent,
        ),
    )
    .flatMap((game) =>
      game.confirmedAt
        ? [
            {
              gameId: game.id,
              title: game.title,
              sessionAt: new Date(game.confirmedAt),
              expiresAt: absenceExpiresAt(game.confirmedAt),
            },
          ]
        : [],
    )
    .filter((absence) => isAbsenceActive({ sessionStartsAt: absence.sessionAt, now }))
    .toSorted((left, right) => right.sessionAt.getTime() - left.sessionAt.getTime());
}
