import { and, eq } from "drizzle-orm";

import { db } from "#/client";
import { games, participants } from "#/schema";

import { evaluateBadges } from "./evaluate-badges";

export async function evaluateGameBadges({
  serverId,
  gameId,
}: {
  serverId: string;
  gameId: string;
}) {
  const [game] = await db
    .select({ gmId: games.gmId })
    .from(games)
    .where(and(eq(games.serverId, serverId), eq(games.id, gameId)));
  if (!game) return;
  const members = await db
    .select({ userId: participants.userId })
    .from(participants)
    .where(and(eq(participants.serverId, serverId), eq(participants.gameId, gameId)));
  await evaluateBadges({
    serverId,
    userIds: [game.gmId, ...members.map((member) => member.userId)],
  });
}
