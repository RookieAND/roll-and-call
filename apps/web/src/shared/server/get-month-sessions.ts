import "server-only";
import { asc } from "drizzle-orm";

import { db } from "./db";
import { games } from "./schema";

export async function getMonthSessions(from: Date, to: Date) {
  return db.query.games.findMany({
    where: (game, { and, gte, lt }) => and(gte(game.confirmedAt, from), lt(game.confirmedAt, to)),
    orderBy: asc(games.confirmedAt),
    with: {
      gm: { columns: { id: true, username: true, avatarUrl: true } },
      participants: {
        columns: { userId: true, status: true },
        with: { user: { columns: { id: true, username: true, avatarUrl: true } } },
      },
    },
  });
}

export type MonthSessionRow = Awaited<ReturnType<typeof getMonthSessions>>[number];
