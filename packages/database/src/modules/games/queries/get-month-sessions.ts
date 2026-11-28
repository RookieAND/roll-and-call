import { asc, sql, type SQL } from "drizzle-orm";

import { db } from "#db/client";
import { memberNicknameSql } from "#db/modules/profiles";

import { firstRoundStartSql } from "./first-round-sql";
import { GAME_LIST_COLUMNS } from "./game-list-columns";
import { publicGamesWhere } from "./public-games-where";

export function findMonthGames({
  serverId,
  where,
  orderBy,
  includeCancelled,
}: {
  serverId: string;
  where?: SQL;
  orderBy?: SQL;
  includeCancelled: boolean;
}) {
  return db.query.games.findMany({
    where: (_game, { and }) => and(where, publicGamesWhere(serverId, { includeCancelled })),
    orderBy,
    columns: GAME_LIST_COLUMNS,
    with: {
      rulebook: { columns: {}, with: { category: { columns: { miniRule: true } } } },
      gm: {
        columns: { id: true, avatarUrl: true },
        extras: { username: memberNicknameSql(serverId) },
      },
      participants: {
        columns: { userId: true, status: true, absent: true, absenceCancelledAt: true },
        where: (participant, { eq }) => eq(participant.serverId, serverId),
        with: {
          user: {
            columns: { id: true, avatarUrl: true },
            extras: { username: memberNicknameSql(serverId) },
          },
        },
      },
    },
  });
}

// 취소된 구인은 홈 날짜 목록의 흐린 카드로만 쓰므로 함께 읽는다. 건수·순위에서는 호출한 쪽이 뺀다.
export async function getMonthSessions({
  serverId,
  from,
  to,
}: {
  serverId: string;
  from: Date;
  to: Date;
}) {
  return findMonthGames({
    serverId,
    where: sql`${firstRoundStartSql} >= ${from.toISOString()}::timestamptz and ${firstRoundStartSql} < ${to.toISOString()}::timestamptz`,
    orderBy: asc(firstRoundStartSql),
    includeCancelled: true,
  });
}

export type MonthSessionRow = Awaited<ReturnType<typeof getMonthSessions>>[number];
