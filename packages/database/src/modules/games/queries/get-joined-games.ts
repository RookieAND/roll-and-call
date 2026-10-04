import { desc } from "drizzle-orm";
import { isNull } from "es-toolkit";

import { db } from "#/client";
import { memberNicknameSql } from "#/modules/profiles/queries/member-nickname-sql";
import { participants } from "#/schema";

export async function getJoinedGames({ serverId, userId }: { serverId: string; userId: string }) {
  const rows = await db.query.participants.findMany({
    where: (participant, { and, eq }) =>
      and(eq(participant.serverId, serverId), eq(participant.userId, userId)),
    orderBy: desc(participants.joinedAt),
    with: {
      game: {
        with: {
          gm: { columns: { avatarUrl: true }, extras: { username: memberNicknameSql(serverId) } },
          participants: {
            columns: {
              userId: true,
              status: true,
              joinedAt: true,
              drawRank: true,
              waitlistedAt: true,
              absent: true,
              absenceCancelledAt: true,
            },
            where: (participant, { eq }) => eq(participant.serverId, serverId),
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
      absent: participant.absent && isNull(absenceCancelledAt),
    })),
  }));
}
