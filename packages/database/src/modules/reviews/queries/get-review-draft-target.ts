import { and, count, eq } from "drizzle-orm";
import { isNull } from "es-toolkit";

import { db } from "#db/client";
import { PARTICIPANT_STATUS } from "#db/modules/games/model";
import {
  firstRoundAttendanceConfirmedAtSql,
  firstRoundEndedAtSql,
  firstRoundStartSql,
} from "#db/modules/games/queries/first-round-sql";
import { findActiveSanction } from "#db/modules/moderation";
import { memberNicknameSql } from "#db/modules/profiles";
import { games, participants, profiles, sessionReviews } from "#db/schema";

import { pickReviewRound } from "./pick-review-round";

const MINUTE_MS = 60_000;

// 다회차는 회차마다 후기를 쓴다. roundNo가 없으면 이미 시작한 가장 뒤 회차를 고르고, 시각·출석 확정·내 후기를 그 회차 것으로 바꾼다.
// 그 회차에 빠진 사람도 쓸 수 있으므로 다회차에서는 불참으로 보류하지 않는다. 단발은 그대로다.
export async function getReviewDraftTarget({
  serverId,
  gameId,
  userId,
  roundNo,
  now = new Date(),
}: {
  serverId: string;
  gameId: string;
  userId: string;
  roundNo?: number;
  now?: Date;
}) {
  const [game] = await db
    .select({
      id: games.id,
      title: games.title,
      rule: games.rule,
      gmId: games.gmId,
      gmName: memberNicknameSql(serverId),
      confirmedAt: firstRoundStartSql,
      playMinutes: games.playMinutes,
      endedAt: firstRoundEndedAtSql,
      cancelledAt: games.cancelledAt,
      attendanceConfirmedAt: firstRoundAttendanceConfirmedAtSql,
      roundCount: games.roundCount,
    })
    .from(games)
    .innerJoin(profiles, eq(profiles.id, games.gmId))
    .where(and(eq(games.serverId, serverId), eq(games.id, gameId)));
  if (!game) return null;
  const round = game.roundCount > 1 ? await pickReviewRound({ gameId, roundNo, now }) : null;
  if (game.roundCount > 1 && !round) return null;
  const timedGame = round
    ? {
        ...game,
        confirmedAt: round.startAt,
        endedAt: round.endedAt,
        attendanceConfirmedAt: round.attendanceConfirmedAt,
        playMinutes:
          round.startAt && round.plannedEndAt
            ? Math.round((round.plannedEndAt.getTime() - round.startAt.getTime()) / MINUTE_MS)
            : game.playMinutes,
      }
    : game;
  const reviewWhere = round
    ? and(eq(sessionReviews.roundId, round.id), eq(sessionReviews.authorId, userId))
    : and(
        eq(sessionReviews.serverId, serverId),
        eq(sessionReviews.gameId, gameId),
        eq(sessionReviews.authorId, userId),
      );

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
    db.select().from(sessionReviews).where(reviewWhere),
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
    game: timedGame,
    round: round && { id: round.id, roundNo: round.roundNo },
    participant: participant && round ? { ...participant, absent: false } : (participant ?? null),
    review: review ?? null,
    suspended: !isNull(sanction),
    isGm: game.gmId === userId,
    confirmedCount: confirmed?.value ?? 0,
  };
}

export type ReviewDraftTarget = NonNullable<Awaited<ReturnType<typeof getReviewDraftTarget>>>;
