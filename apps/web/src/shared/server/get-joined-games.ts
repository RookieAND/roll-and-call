import "server-only";
import { db, participants } from "@trpg/database";
import { desc } from "drizzle-orm";

export async function getJoinedGames(userId: string) {
  const rows = await db.query.participants.findMany({
    where: (participant, { eq }) => eq(participant.userId, userId),
    orderBy: desc(participants.joinedAt),
    with: {
      game: {
        with: {
          gm: { columns: { username: true, avatarUrl: true } },
          participants: {
            columns: { userId: true, status: true, joinedAt: true },
          },
        },
      },
    },
  });
  return rows.map((row) => row.game);
}
