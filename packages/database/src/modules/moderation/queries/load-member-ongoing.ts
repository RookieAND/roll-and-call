import { and, eq, inArray, isNull, or } from "drizzle-orm";

import { db } from "#/client";
import { pickMemberOngoing, type MemberOngoing } from "#/modules/moderation/model/member-ongoing";
import { memberNicknameSql } from "#/modules/profiles/queries/member-nickname-sql";
import type { Transaction } from "#/modules/transaction/transaction";
import { games, participants, profiles } from "#/schema";

// 제재 페이지·제재 확정·추방 영향이 함께 쓰는 정리 범위. 판단은 pickMemberOngoing이 한다.
export async function loadMemberOngoing({
  executor = db,
  serverId,
  userId,
  now = new Date(),
}: {
  executor?: Transaction | typeof db;
  serverId: string;
  userId: string;
  now?: Date;
}): Promise<MemberOngoing[]> {
  const joined = executor
    .select({ gameId: participants.gameId })
    .from(participants)
    .where(and(eq(participants.serverId, serverId), eq(participants.userId, userId)));
  const rows = await executor
    .select({ game: games, gmNickname: memberNicknameSql(serverId) })
    .from(games)
    .innerJoin(profiles, eq(profiles.id, games.gmId))
    .where(
      and(
        eq(games.serverId, serverId),
        isNull(games.cancelledAt),
        or(eq(games.gmId, userId), inArray(games.id, joined)),
      ),
    );
  const gameIds = rows.map((row) => row.game.id);
  const roster =
    gameIds.length === 0
      ? []
      : await executor
          .select({
            gameId: participants.gameId,
            userId: participants.userId,
            status: participants.status,
          })
          .from(participants)
          .where(and(eq(participants.serverId, serverId), inArray(participants.gameId, gameIds)));
  return pickMemberOngoing({
    userId,
    games: rows.map((row) => ({ ...row.game, gmNickname: row.gmNickname })),
    roster,
    now,
  });
}
