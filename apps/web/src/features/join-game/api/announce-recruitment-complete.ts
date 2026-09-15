import "server-only";
import { PARTICIPANT_STATUS } from "@/entities/game";
import { db, notifyRecruitmentComplete } from "@/shared/server";

import { UNKNOWN_USERNAME } from "../model/unknown-username";

export async function announceRecruitmentComplete(gameId: string) {
  const game = await db.query.games.findFirst({
    where: (table, { eq: equals }) => equals(table.id, gameId),
    with: {
      gm: { columns: { username: true } },
      participants: {
        where: (participant, { eq: equals }) =>
          equals(participant.status, PARTICIPANT_STATUS.confirmed),
        orderBy: (participant, { asc }) => asc(participant.joinedAt),
        with: { user: { columns: { username: true } } },
      },
    },
  });
  if (!game) return;

  const playerNames = game.participants.map(
    (participant) => participant.user?.username ?? UNKNOWN_USERNAME,
  );
  await notifyRecruitmentComplete(game, game.gm?.username ?? UNKNOWN_USERNAME, playerNames);
}
