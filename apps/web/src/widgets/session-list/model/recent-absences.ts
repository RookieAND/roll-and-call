import { isNull } from "es-toolkit";

import { absenceExpiresAt } from "@/entities/game";

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
        !isNull(game.confirmedAt) &&
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
