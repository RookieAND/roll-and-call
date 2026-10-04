import { and, eq } from "drizzle-orm";

import { db } from "#/client";
import type { BadgeFacts } from "#/modules/badges/model/badge-facts";
import { toBadgeSessions } from "#/modules/badges/model/to-badge-sessions";
import { games, participants, rulebookCategories, rulebooks } from "#/schema";

import { attendedWhere } from "./attended-where";
import { loadHiddenBadgeFacts } from "./load-hidden-badge-facts";
import { recognizedGamesWhere } from "./recognized-games-where";
import { sessionColumns } from "./session-columns";

export async function loadBadgeFacts({
  serverId,
  userId,
  now = new Date(),
}: {
  serverId: string;
  userId: string;
  now?: Date;
}): Promise<BadgeFacts> {
  const [played, hosted, hidden] = await Promise.all([
    db
      .select(sessionColumns)
      .from(participants)
      .innerJoin(games, eq(games.id, participants.gameId))
      .leftJoin(rulebooks, eq(rulebooks.id, games.rulebookId))
      .leftJoin(rulebookCategories, eq(rulebookCategories.id, rulebooks.categoryId))
      .where(
        and(
          eq(games.serverId, serverId),
          eq(participants.userId, userId),
          attendedWhere,
          recognizedGamesWhere,
        ),
      ),
    db
      .select(sessionColumns)
      .from(games)
      .leftJoin(rulebooks, eq(rulebooks.id, games.rulebookId))
      .leftJoin(rulebookCategories, eq(rulebookCategories.id, rulebooks.categoryId))
      .where(and(eq(games.serverId, serverId), eq(games.gmId, userId), recognizedGamesWhere)),
    loadHiddenBadgeFacts({ serverId, userId }),
  ]);
  return {
    played: toBadgeSessions(played, now),
    hosted: toBadgeSessions(hosted, now),
    ...hidden,
    asOf: now,
  };
}
