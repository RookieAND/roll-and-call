import { and, eq, isNull } from "drizzle-orm";

import { db } from "#/client";
import { HIDDEN_LADDER } from "#/modules/badges/model/badge-ladder";
import { games, userBadges } from "#/schema";

import { applyBadgeWrites } from "./apply-badge-writes";

const RUSH_MIN_PLAYERS = 3;
const RUSH_WINDOW_MS = 60 * 60 * 1000;

// 광클 마감은 선착순 정원이 찬 순간에만 판정한다(R28). 재계산은 새로 주지 않고 이미 받은 것만 지킨다.
export async function grantRushBadge({
  serverId,
  gameId,
  now = new Date(),
}: {
  serverId: string;
  gameId: string;
  now?: Date;
}) {
  const [game] = await db
    .select({
      gmId: games.gmId,
      maxPlayers: games.maxPlayers,
      recruitMethod: games.recruitMethod,
      createdAt: games.createdAt,
    })
    .from(games)
    .where(
      and(
        eq(games.serverId, serverId),
        eq(games.id, gameId),
        isNull(games.hiddenAt),
        isNull(games.cancelledAt),
      ),
    );
  if (
    !game ||
    game.recruitMethod !== "first_come" ||
    game.maxPlayers < RUSH_MIN_PLAYERS ||
    now.getTime() - game.createdAt.getTime() > RUSH_WINDOW_MS
  ) {
    return;
  }
  const [held] = await db
    .select({ badgeKey: userBadges.badgeKey })
    .from(userBadges)
    .where(
      and(
        eq(userBadges.serverId, serverId),
        eq(userBadges.userId, game.gmId),
        eq(userBadges.badgeKey, HIDDEN_LADDER.rush),
        isNull(userBadges.revokedAt),
      ),
    );
  if (held) return;
  await applyBadgeWrites({
    serverId,
    userId: game.gmId,
    writes: [
      {
        kind: "grant",
        badge: { badgeKey: HIDDEN_LADDER.rush, tier: 1, earnedAt: now, sourceGameId: gameId },
      },
    ],
    now,
  });
}
