import {
  db,
  games,
  participants,
  profiles,
  rulebookCategories,
  rulebooks,
  sessionReviews,
} from "@roll-and-call/database";
import { and, eq } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

const gm = alias(profiles, "gm");

export async function loadForumReview(reviewId: string) {
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
      gmName: gm.username,
      authorName: profiles.username,
      authorAvatar: profiles.avatarUrl,
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
    .where(eq(sessionReviews.id, reviewId));
  return row;
}

export type ForumReview = NonNullable<Awaited<ReturnType<typeof loadForumReview>>>;
