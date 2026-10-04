import { and, sql } from "drizzle-orm";

import { db } from "#/client";
import type { GamesFilter } from "#/modules/games/model/games-filter";
import { games } from "#/schema";

import { gameBucketSql } from "./game-bucket-sql";
import { gameFiltersWhere } from "./game-filters-where";
import { searchableGamesWhere } from "./searchable-games-where";

// 종료는 진행 중이 될 수 없어 지난 구인 = 마감 + 종료다. 취소된 구인은 어느 건수에도 넣지 않는다.
export async function getGamesCounts({
  serverId,
  q,
  filter = {},
}: {
  serverId: string;
  q: string | undefined;
  filter?: GamesFilter;
}) {
  const { full, ended, live } = gameBucketSql({ now: new Date() });
  const count = (condition: ReturnType<typeof sql>) =>
    sql<number>`(count(*) filter (where ${condition}))::int`;
  const [row] = await db
    .select({
      live: count(live),
      recruiting: count(sql`${live} and not ${full}`),
      waitlist: count(sql`${live} and ${full}`),
      past: count(sql`not ${live}`),
      closed: count(sql`not ${live} and not ${ended}`),
      ended: count(ended),
    })
    .from(games)
    .where(and(searchableGamesWhere({ serverId, q }), gameFiltersWhere(filter)));
  return row!;
}

export type GamesCounts = Awaited<ReturnType<typeof getGamesCounts>>;
