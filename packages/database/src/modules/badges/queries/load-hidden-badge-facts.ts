import { and, count, eq, isNotNull, isNull, sql } from "drizzle-orm";

import { db } from "#/client";
import type { BadgeFacts } from "#/modules/badges/model/badge-facts";
import { HIDDEN_LADDER } from "#/modules/badges/model/badge-ladder";
import { drawResults, games, serverMembers, userBadges } from "#/schema";

// 대기 명단에서 굴린 값이 가장 작은 사람이 대기 1번이다(작을수록 앞).
const isFirstWaiting = sql<boolean>`${drawResults.status} = 'waiting' and not exists (
  select 1 from ${drawResults} as ahead
  where ahead.game_id = ${drawResults.gameId}
    and ahead.status = 'waiting'
    and ahead.roll < ${drawResults.roll}
)`;

type HiddenBadgeFacts = Pick<BadgeFacts, "draws" | "hostedDraws" | "joinedAt" | "rush">;

// 숨겨진 칭호만 쓰는 기록. 숨기거나 취소한 구인은 근거에서 빠져 칭호도 회수된다.
export async function loadHiddenBadgeFacts({
  serverId,
  userId,
}: {
  serverId: string;
  userId: string;
}): Promise<HiddenBadgeFacts> {
  const visibleGame = and(
    eq(games.serverId, serverId),
    isNull(games.hiddenAt),
    isNull(games.cancelledAt),
  );
  const [draws, hostedDraws, [member], rush] = await Promise.all([
    db
      .select({
        gameId: drawResults.gameId,
        roll: drawResults.roll,
        nearMiss: isFirstWaiting,
        drawnAt: games.drawnAt,
      })
      .from(drawResults)
      .innerJoin(games, eq(games.id, drawResults.gameId))
      .where(
        and(
          visibleGame,
          eq(drawResults.userId, userId),
          isNotNull(drawResults.roll),
          isNotNull(games.drawnAt),
        ),
      ),
    db
      .select({
        gameId: games.id,
        applicants: count(drawResults.roll),
        maxPlayers: games.maxPlayers,
        drawnAt: games.drawnAt,
      })
      .from(games)
      .innerJoin(drawResults, eq(drawResults.gameId, games.id))
      .where(and(visibleGame, eq(games.gmId, userId), isNotNull(games.drawnAt)))
      .groupBy(games.id),
    db
      .select({ joinedAt: serverMembers.joinedAt })
      .from(serverMembers)
      .where(and(eq(serverMembers.serverId, serverId), eq(serverMembers.userId, userId))),
    db
      .select({ at: userBadges.earnedAt, gameId: userBadges.sourceGameId })
      .from(userBadges)
      .innerJoin(games, eq(games.id, userBadges.sourceGameId))
      .where(
        and(
          visibleGame,
          eq(userBadges.serverId, serverId),
          eq(userBadges.userId, userId),
          eq(userBadges.badgeKey, HIDDEN_LADDER.rush),
        ),
      ),
  ]);
  return {
    draws: draws.map((draw) => ({ ...draw, roll: draw.roll!, drawnAt: draw.drawnAt! })),
    hostedDraws: hostedDraws.map((draw) => ({ ...draw, drawnAt: draw.drawnAt! })),
    joinedAt: member?.joinedAt ?? null,
    rush,
  };
}
