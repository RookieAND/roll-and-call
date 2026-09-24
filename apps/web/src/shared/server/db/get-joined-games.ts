import "server-only";
import { db, participants } from "@roll-and-call/database";
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
            columns: {
              userId: true,
              status: true,
              joinedAt: true,
              absent: true,
              absenceCancelledAt: true,
            },
          },
        },
      },
    },
  });
  // 운영진이 취소한 불참은 불참으로 세지 않는다.
  return rows.map(({ game }) => ({
    ...game,
    participants: game.participants.map(({ absenceCancelledAt, ...participant }) => ({
      ...participant,
      absent: participant.absent && absenceCancelledAt === null,
    })),
  }));
}
