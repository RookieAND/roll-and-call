import { and, eq, isNull, not, sql } from "drizzle-orm";

import { db } from "#/client";
import type { BadgeFacts } from "#/modules/badges/model/badge-facts";
import { toBadgeSessions } from "#/modules/badges/model/to-badge-sessions";
import { games, participants, rulebookCategories, rulebooks, sessionReviews } from "#/schema";

import { attendedWhere } from "./attended-where";
import { loadHiddenBadgeFacts } from "./load-hidden-badge-facts";
import { recognizedGamesWhere } from "./recognized-games-where";
import { sessionColumns } from "./session-columns";

// 후기 작성자가 지금 불참이면 보류된 후기라 세지 않는다.
const reviewAuthorAbsent = sql<boolean>`exists (
  select 1 from ${participants}
  where ${participants.gameId} = ${sessionReviews.gameId}
    and ${participants.userId} = ${sessionReviews.authorId}
    and ${participants.absent}
    and ${participants.absenceCancelledAt} is null
)`;

export async function loadBadgeFacts({
  serverId,
  userId,
  now = new Date(),
}: {
  serverId: string;
  userId: string;
  now?: Date;
}): Promise<BadgeFacts> {
  const visibleReview = and(
    eq(games.serverId, serverId),
    isNull(games.hiddenAt),
    isNull(games.cancelledAt),
    isNull(sessionReviews.removedAt),
    isNull(sessionReviews.hiddenAt),
    not(reviewAuthorAbsent),
  );
  const [played, hosted, reviews, written, hidden] = await Promise.all([
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
    db
      .select({ gameId: sessionReviews.gameId, createdAt: sessionReviews.createdAt })
      .from(sessionReviews)
      .innerJoin(games, eq(games.id, sessionReviews.gameId))
      .where(and(eq(games.gmId, userId), visibleReview)),
    db
      .select({ gameId: sessionReviews.gameId, createdAt: sessionReviews.createdAt })
      .from(sessionReviews)
      .innerJoin(games, eq(games.id, sessionReviews.gameId))
      .where(and(eq(sessionReviews.authorId, userId), visibleReview)),
    loadHiddenBadgeFacts({ serverId, userId }),
  ]);
  return {
    played: toBadgeSessions(played, now),
    hosted: toBadgeSessions(hosted, now),
    reviews,
    written,
    ...hidden,
    asOf: now,
  };
}
