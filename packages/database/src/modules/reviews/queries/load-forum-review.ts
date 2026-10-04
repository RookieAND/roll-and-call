import { and, eq } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

import { db } from "#/client";
import { memberNicknameSql } from "#/modules/profiles/queries/member-nickname-sql";
import {
  games,
  participants,
  profiles,
  rulebookCategories,
  rulebooks,
  sessionReviews,
} from "#/schema";

const gm = alias(profiles, "gm");

export async function loadForumReview({
  serverId,
  reviewId,
}: {
  serverId: string;
  reviewId: string;
}) {
  const [row] = await db
    .select({
      id: sessionReviews.id,
      gameId: sessionReviews.gameId,
      body: sessionReviews.body,
      spoiler: sessionReviews.spoiler,
      photoUrls: sessionReviews.photoUrls,
      hiddenAt: sessionReviews.hiddenAt,
      removedAt: sessionReviews.removedAt,
      threadId: sessionReviews.discordThreadId,
      gameTitle: games.title,
      rule: games.rule,
      category: rulebookCategories.name,
      gmName: memberNicknameSql(serverId, gm),
      authorName: memberNicknameSql(serverId),
      authorDiscordId: profiles.discordId,
      absent: participants.absent,
      absenceCancelledAt: participants.absenceCancelledAt,
    })
    .from(sessionReviews)
    .innerJoin(games, eq(games.id, sessionReviews.gameId))
    .innerJoin(profiles, eq(profiles.id, sessionReviews.authorId))
    .innerJoin(gm, eq(gm.id, games.gmId))
    .leftJoin(rulebooks, eq(rulebooks.id, games.rulebookId))
    .leftJoin(rulebookCategories, eq(rulebookCategories.id, rulebooks.categoryId))
    .leftJoin(
      participants,
      and(
        eq(participants.gameId, sessionReviews.gameId),
        eq(participants.userId, sessionReviews.authorId),
      ),
    )
    .where(and(eq(sessionReviews.serverId, serverId), eq(sessionReviews.id, reviewId)));
  return row;
}

export type ForumReview = NonNullable<Awaited<ReturnType<typeof loadForumReview>>>;
