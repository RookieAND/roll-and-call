import { asc } from "drizzle-orm";

import { db } from "#/client";
import { memberNicknameSql } from "#/modules/profiles/queries/member-nickname-sql";
import { games } from "#/schema";

import { publicGamesWhere } from "./public-games-where";

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
  return db.query.games.findMany({
    where: (game, { and, gte, lt }) =>
      and(
        gte(game.confirmedAt, from),
        lt(game.confirmedAt, to),
        publicGamesWhere(serverId, { includeCancelled: true }),
      ),
    orderBy: asc(games.confirmedAt),
    with: {
      rulebook: { columns: { miniRule: true } },
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

export type MonthSessionRow = Awaited<ReturnType<typeof getMonthSessions>>[number];
