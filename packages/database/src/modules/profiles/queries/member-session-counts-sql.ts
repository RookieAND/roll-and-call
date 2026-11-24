import { and, eq, isNotNull, isNull, lte, not, or, sql } from "drizzle-orm";

import { db } from "#db/client";
import { PARTICIPANT_STATUS } from "#db/modules/games/model/participant-status";
import { confirmedCountSql } from "#db/modules/games/queries/confirmed-count-sql";
import { firstRoundStartSql } from "#db/modules/games/queries/first-round-sql";
import { gameBucketSql } from "#db/modules/games/queries/game-bucket-sql";
import { gameRounds, games, participants, profiles, roundAttendances } from "#db/schema";

// countRecordSessions(includeInProgress)의 SQL판. 정의를 바꾸면 apps/web/src/entities/game/model/count-record-sessions.ts와 함께 바꾼다.
// 다회차 출석은 (game_id, user_id) 복합 FK로 참여 행이 있는 사람만 있어 참여 행 확인을 따로 하지 않는다.
export function memberSessionCountsSql({ serverId, now }: { serverId: string; now: Date }) {
  const at = sql`${now.toISOString()}::timestamptz`;
  const { ended } = gameBucketSql({ now });
  // 시작했지만 끝나지 않은 세션. 시작 전(참여 예정)은 세지 않는다.
  const inProgress = and(
    sql`${firstRoundStartSql} is not null`,
    sql`${firstRoundStartSql} <= ${at}`,
    not(ended),
  )!;
  const counted = and(
    isNull(games.cancelledAt),
    isNull(games.hiddenAt),
    or(inProgress, and(ended, isNotNull(games.confirmedAt), sql`${confirmedCountSql} > 0`)),
  )!;
  const countAs = (alias: string) => sql<number>`count(*)::int`.as(alias);

  // ponytail: profiles를 join하는 건 표 이름이 붙게 하려는 것이다(recruitingCountsByGm 참고).
  const hosted = db
    .select({ userId: games.gmId, count: countAs("hosted_count") })
    .from(games)
    .innerJoin(profiles, eq(profiles.id, games.gmId))
    .where(and(eq(games.serverId, serverId), counted))
    .groupBy(games.gmId)
    .as("hosted");

  const playedSingle = db
    .select({ userId: participants.userId, count: countAs("single_count") })
    .from(participants)
    .innerJoin(games, eq(games.id, participants.gameId))
    .where(
      and(
        eq(participants.serverId, serverId),
        eq(games.serverId, serverId),
        sql`${games.roundCount} <= 1`,
        eq(participants.status, PARTICIPANT_STATUS.confirmed),
        or(eq(participants.absent, false), isNotNull(participants.absenceCancelledAt)),
        counted,
      ),
    )
    .groupBy(participants.userId)
    .as("played_single");

  const playedMulti = db
    .select({ userId: roundAttendances.userId, count: countAs("multi_count") })
    .from(roundAttendances)
    .innerJoin(gameRounds, eq(gameRounds.id, roundAttendances.roundId))
    .innerJoin(games, eq(games.id, roundAttendances.gameId))
    .where(
      and(
        eq(roundAttendances.serverId, serverId),
        eq(games.serverId, serverId),
        eq(roundAttendances.attended, true),
        sql`${games.roundCount} > 1`,
        isNull(games.cancelledAt),
        isNull(games.hiddenAt),
        isNotNull(gameRounds.attendanceConfirmedAt),
        lte(sql`coalesce(${gameRounds.endedAt}, ${gameRounds.plannedEndAt})`, at),
      ),
    )
    .groupBy(roundAttendances.userId)
    .as("played_multi");

  return { hosted, playedSingle, playedMulti };
}
