import { and, asc, eq, isNull } from "drizzle-orm";

import { db } from "#/client";
import type { BadgeFacts } from "#/modules/badges/model/badge-facts";
import { toBadgeSessions } from "#/modules/badges/model/to-badge-sessions";
import {
  certifications,
  games,
  participants,
  rulebookCategories,
  rulebooks,
  sessionReviews,
} from "#/schema";

import { attendedWhere } from "./attended-where";
import { countedReviewWhere } from "./counted-review-where";
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
  const countedReview = countedReviewWhere(serverId);
  const [played, hosted, reviews, written, certified, hidden] = await Promise.all([
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
      .where(and(eq(games.gmId, userId), countedReview)),
    db
      .select({ gameId: sessionReviews.gameId, createdAt: sessionReviews.createdAt })
      .from(sessionReviews)
      .innerJoin(games, eq(games.id, sessionReviews.gameId))
      .where(and(eq(sessionReviews.authorId, userId), countedReview)),
    db
      .select({ at: certifications.approvedAt })
      .from(certifications)
      .where(
        and(
          eq(certifications.serverId, serverId),
          eq(certifications.userId, userId),
          isNull(certifications.revokedAt),
        ),
      )
      .orderBy(asc(certifications.approvedAt)),
    loadHiddenBadgeFacts({ serverId, userId }),
  ]);
  return {
    played: toBadgeSessions(played, now),
    hosted: toBadgeSessions(hosted, now),
    reviews,
    written,
    certified: certified.map((row) => ({ at: row.at, gameId: null })),
    ...hidden,
    asOf: now,
  };
}
