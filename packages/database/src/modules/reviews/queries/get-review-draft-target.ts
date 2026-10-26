import { and, count, eq } from "drizzle-orm";
import { isNull } from "es-toolkit";

import { db } from "#db/client";
import { PARTICIPANT_STATUS } from "#db/modules/games/model";
import { findActiveSanction } from "#db/modules/moderation";
import { memberNicknameSql } from "#db/modules/profiles";
import { games, participants, profiles, sessionReviews } from "#db/schema";

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
      endedAt: games.endedAt,
      cancelledAt: games.cancelledAt,
      attendanceConfirmedAt: games.attendanceConfirmedAt,
    })
    .from(games)
    .innerJoin(profiles, eq(profiles.id, games.gmId))
    .where(and(eq(games.serverId, serverId), eq(games.id, gameId)));
  if (!game) return null;

  const [[participant], [review], sanction, [confirmed]] = await Promise.all([
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
    findActiveSanction({ serverId, userId }),
    db
      .select({ value: count() })
      .from(participants)
      .where(
        and(
          eq(participants.serverId, serverId),
          eq(participants.gameId, gameId),
          eq(participants.status, PARTICIPANT_STATUS.confirmed),
        ),
      ),
  ]);

  return {
    game,
    participant: participant ?? null,
    review: review ?? null,
    suspended: !isNull(sanction),
    isGm: game.gmId === userId,
    confirmedCount: confirmed?.value ?? 0,
  };
}

export type ReviewDraftTarget = NonNullable<Awaited<ReturnType<typeof getReviewDraftTarget>>>;
