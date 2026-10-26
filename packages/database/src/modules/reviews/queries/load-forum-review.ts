import { and, asc, eq, isNotNull, or } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

import { db } from "#db/client";
import { REVIEW_AUTHOR_ROLE } from "#db/modules/games/model";
import { memberNicknameSql } from "#db/modules/profiles";
import {
  games,
  participants,
  profiles,
  rulebookCategories,
  rulebooks,
  sessionReviews,
} from "#db/schema";

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
      isGmReview: eq(sessionReviews.authorRole, REVIEW_AUTHOR_ROLE.gm),
      body: sessionReviews.body,
      spoiler: sessionReviews.spoiler,
      photoUrls: sessionReviews.photoUrls,
      hiddenAt: sessionReviews.hiddenAt,
      removedAt: sessionReviews.removedAt,
      threadId: sessionReviews.discordThreadId,
      gameTitle: games.title,
      gameHiddenAt: games.hiddenAt,
      gameVisibility: games.visibility,
      rule: games.rule,
      category: rulebookCategories.name,
      gmName: memberNicknameSql(serverId, gm),
      gmDiscordId: gm.discordId,
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
  if (!row) return undefined;
  // 후기 양식의 {참여자 멘션}에 쓴다. 확정되어 실제로 참석한 사람만, 합류한 순서대로.
  const players = await db
    .select({ discordId: profiles.discordId })
    .from(participants)
    .innerJoin(profiles, eq(profiles.id, participants.userId))
    .where(
      and(
        eq(participants.gameId, row.gameId),
        eq(participants.status, "confirmed"),
        or(eq(participants.absent, false), isNotNull(participants.absenceCancelledAt)),
      ),
    )
    .orderBy(asc(participants.joinedAt));
  return { ...row, participantDiscordIds: players.map((player) => player.discordId) };
}

export type ForumReview = NonNullable<Awaited<ReturnType<typeof loadForumReview>>>;
