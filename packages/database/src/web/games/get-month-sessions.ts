import { asc } from "drizzle-orm";

import { db } from "../../client";
import { games } from "../../schema";
import { publicGamesWhere } from "./public-games-where";

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
      and(gte(game.confirmedAt, from), lt(game.confirmedAt, to), publicGamesWhere(serverId)),
    orderBy: asc(games.confirmedAt),
    with: {
      gm: { columns: { id: true, username: true, avatarUrl: true } },
      participants: {
        columns: { userId: true, status: true, absent: true, absenceCancelledAt: true },
        where: (participant, { eq }) => eq(participant.serverId, serverId),
        with: { user: { columns: { id: true, username: true, avatarUrl: true } } },
      },
    },
  });
}

export type MonthSessionRow = Awaited<ReturnType<typeof getMonthSessions>>[number];
