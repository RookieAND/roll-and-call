import "server-only";
import type { GamesFilter } from "@/shared/api";

import { db } from "./db";
import { games } from "./schema";
import { recruitingGamesOrderBy } from "./recruiting-games-order-by";
import { recruitingGamesWhere } from "./recruiting-games-where";

export const GAMES_PAGE_SIZE = 12;

export async function getRecruitingGamesPage(
  page: number,
  filter: GamesFilter = {},
  pageSize = GAMES_PAGE_SIZE,
) {
  const where = recruitingGamesWhere(filter, new Date());
  const offset = (Math.max(1, page) - 1) * pageSize;
  const [rows, total] = await Promise.all([
    db.query.games.findMany({
      where,
      orderBy: recruitingGamesOrderBy(filter.sort),
      with: {
        gm: { columns: { username: true, avatarUrl: true } },
        participants: { columns: { userId: true, status: true } },
      },
      limit: pageSize,
      offset,
    }),
    db.$count(games, where),
  ]);
  return { rows, total, pageSize };
}
