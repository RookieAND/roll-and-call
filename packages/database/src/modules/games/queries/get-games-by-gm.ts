import { desc, inArray } from "drizzle-orm";

import { db } from "#db/client";
import { roundScheduleProgress } from "#db/modules/games/model/round-schedule-progress";
import { memberNicknameSql } from "#db/modules/profiles";
import { gameRounds, games } from "#db/schema";

export async function getGamesByGm({ serverId, userId }: { serverId: string; userId: string }) {
  const rows = await db.query.games.findMany({
    where: (game, { and, eq }) => and(eq(game.serverId, serverId), eq(game.gmId, userId)),
    orderBy: desc(games.createdAt),
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
        },
        where: (participant, { eq }) => eq(participant.serverId, serverId),
      },
    },
  });
  // 조율형 다회차는 홈의 「n회차 일정을 잡아 주세요」 할 일을 위해 일정 진행을 붙인다.
  const coordinatedIds = rows
    .filter((game) => game.roundScheduleKind === "coordinated" && game.roundCount > 1)
    .map((game) => game.id);
  if (coordinatedIds.length === 0) return rows;
  const rounds = await db
    .select({
      gameId: gameRounds.gameId,
      roundNo: gameRounds.roundNo,
      startAt: gameRounds.startAt,
      plannedEndAt: gameRounds.plannedEndAt,
      endedAt: gameRounds.endedAt,
    })
    .from(gameRounds)
    .where(inArray(gameRounds.gameId, coordinatedIds));
  return rows.map((game) =>
    coordinatedIds.includes(game.id)
      ? {
          ...game,
          ...roundScheduleProgress(rounds.filter((round) => round.gameId === game.id)),
        }
      : game,
  );
}
