import { and, eq, isNotNull, isNull, sql } from "drizzle-orm";

import { db } from "#db/client";
import type { BadgeFacts, BadgeSession } from "#db/modules/badges/model/badge-facts";
import { isTieSession } from "#db/modules/badges/model/is-tie-session";
import { gameRounds, games, rulebookCategories, rulebooks, roundAttendances } from "#db/schema";

import { categoryColumns } from "./session-columns";

type MultiRoundSessions = Pick<BadgeFacts, "played" | "hosted">;

const roundEnd = sql<Date>`coalesce(${gameRounds.endedAt}, ${gameRounds.plannedEndAt})`.mapWith(
  gameRounds.startAt,
);

const attendedInRound = sql<number>`(
  select count(*)::int from ${roundAttendances} as present
  where present.round_id = ${gameRounds.id} and present.attended = true
)`;

const isMultiRound = sql`${games.roundCount} > 1`;

// 단발은 loadBadgeFacts가 첫 회차 기준으로 따로 읽는다. 여기는 다회차를 출석을 확정한 회차마다 한 건씩 담는다.
export async function loadMultiRoundSessions({
  serverId,
  userId,
}: {
  serverId: string;
  userId: string;
}): Promise<MultiRoundSessions> {
  const alive = and(
    eq(games.serverId, serverId),
    isMultiRound,
    isNull(games.hiddenAt),
    isNull(games.cancelledAt),
  );
  const confirmedRounds = (extra: ReturnType<typeof and>) =>
    db
      .select({
        gameId: games.id,
        roundId: gameRounds.id,
        title: games.title,
        startsAt: gameRounds.startAt,
        endsAt: roundEnd,
        ...categoryColumns,
        attendedCount: attendedInRound,
        registeredAt: games.createdAt,
      })
      .from(gameRounds)
      .innerJoin(games, eq(games.id, gameRounds.gameId))
      .leftJoin(rulebooks, eq(rulebooks.id, games.rulebookId))
      .leftJoin(rulebookCategories, eq(rulebookCategories.id, rulebooks.categoryId))
      .where(
        and(
          alive,
          isNotNull(gameRounds.startAt),
          isNotNull(gameRounds.attendanceConfirmedAt),
          sql`${roundEnd} <= now()`,
          extra,
        ),
      );
  const attendedBy = sql`exists (
    select 1 from ${roundAttendances} as mine
    where mine.round_id = ${gameRounds.id} and mine.user_id = ${userId} and mine.attended = true
  )`;
  const [played, hosted] = await Promise.all([
    confirmedRounds(attendedBy),
    confirmedRounds(eq(games.gmId, userId)),
  ]);
  // 타이만(1:1)은 단발과 같이 업적에서 뺀다.
  const keep = (
    rows: Array<
      Omit<BadgeSession, "startsAt" | "endsAt"> & { startsAt: Date | null; endsAt: Date | null }
    >,
  ) =>
    rows
      .filter((row) => row.attendedCount >= 1 && !isTieSession(row.attendedCount))
      .map((row) => ({ ...row, startsAt: row.startsAt!, endsAt: row.endsAt! }));
  return {
    played: keep(played),
    hosted: keep(hosted),
  };
}
