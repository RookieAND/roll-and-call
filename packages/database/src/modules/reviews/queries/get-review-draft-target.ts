import { and, eq } from "drizzle-orm";

import { db } from "#/client";
import { memberNicknameSql } from "#/modules/profiles/queries/member-nickname-sql";
import { games, participants, profiles, sessionReviews } from "#/schema";

export async function getReviewDraftTarget({
  serverId,
  gameId,
  userId,
}: {
  serverId: string;
  gameId: string;
  userId: string;
}) {
  const [game] = await db
    .select({
      id: games.id,
      title: games.title,
      rule: games.rule,
      gmId: games.gmId,
      gmName: memberNicknameSql(serverId),
      confirmedAt: games.confirmedAt,
      playMinutes: games.playMinutes,
      attendanceConfirmedAt: games.attendanceConfirmedAt,
    })
    .from(games)
    .innerJoin(profiles, eq(profiles.id, games.gmId))
    .where(and(eq(games.serverId, serverId), eq(games.id, gameId)));
  if (!game) return null;

  const [[participant], [review]] = await Promise.all([
    db
      .select({
        status: participants.status,
        absent: participants.absent,
        absenceCancelledAt: participants.absenceCancelledAt,
      })
      .from(participants)
      .where(
        and(
          eq(participants.serverId, serverId),
          eq(participants.gameId, gameId),
          eq(participants.userId, userId),
        ),
      ),
    db
      .select()
      .from(sessionReviews)
      .where(
        and(
          eq(sessionReviews.serverId, serverId),
          eq(sessionReviews.gameId, gameId),
          eq(sessionReviews.authorId, userId),
        ),
      ),
  ]);

  return { game, participant: participant ?? null, review: review ?? null };
}

export type ReviewDraftTarget = NonNullable<Awaited<ReturnType<typeof getReviewDraftTarget>>>;
