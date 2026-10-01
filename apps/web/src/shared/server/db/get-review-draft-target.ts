import "server-only";
import { db, games, participants, profiles, sessionReviews } from "@roll-and-call/database";
import { and, eq } from "drizzle-orm";

export async function getReviewDraftTarget(gameId: string, userId: string) {
  const [game] = await db
    .select({
      id: games.id,
      title: games.title,
      rule: games.rule,
      gmId: games.gmId,
      gmName: profiles.username,
      confirmedAt: games.confirmedAt,
      playMinutes: games.playMinutes,
      attendanceConfirmedAt: games.attendanceConfirmedAt,
    })
    .from(games)
    .innerJoin(profiles, eq(profiles.id, games.gmId))
    .where(eq(games.id, gameId));
  if (!game) return null;

  const [[participant], [review]] = await Promise.all([
    db
      .select({
        status: participants.status,
        absent: participants.absent,
        absenceCancelledAt: participants.absenceCancelledAt,
      })
      .from(participants)
      .where(and(eq(participants.gameId, gameId), eq(participants.userId, userId))),
    db
      .select()
      .from(sessionReviews)
      .where(and(eq(sessionReviews.gameId, gameId), eq(sessionReviews.authorId, userId))),
  ]);

  return { game, participant: participant ?? null, review: review ?? null };
}

export type ReviewDraftTarget = NonNullable<Awaited<ReturnType<typeof getReviewDraftTarget>>>;
