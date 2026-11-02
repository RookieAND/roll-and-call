import { and, sql, type SQL } from "drizzle-orm";

import { db } from "#db/client";
import type { GamesFilter } from "#db/modules/games/model/games-filter";
import { games } from "#db/schema";

import { gameBucketSql } from "./game-bucket-sql";
import { gameFiltersWhere } from "./game-filters-where";
import { publicVisibilityWhere } from "./public-visibility-where";
import { searchableGamesWhere } from "./searchable-games-where";

// 종료는 진행 중이 될 수 없어 지난 구인 = 마감 + 종료다. includePrivate가 꺼지면 지난 구인 쪽 건수에서만 지정 구인을 뺀다. 취소된 구인은 어느 건수에도 넣지 않는다.
export async function getGamesCounts({
  serverId,
  q,
  filter = {},
}: {
  serverId: string;
  q: string | undefined;
  filter?: GamesFilter;
}) {
  const now = new Date();
  const { full, ended, live } = gameBucketSql({ now });
  const count = (condition: SQL) => sql<number>`(count(*) filter (where ${condition}))::int`;
  const past =
    filter.includePrivate === false
      ? sql`not ${live} and ${publicVisibilityWhere}`
      : sql`not ${live}`;
  const [row] = await db
    .select({
      live: count(live),
      recruiting: count(sql`${live} and not ${full}`),
      waitlist: count(sql`${live} and ${full}`),
      past: count(past),
      closed: count(sql`${past} and not ${ended}`),
      ended: count(sql`${past} and ${ended}`),
    })
    .from(games)
    .where(and(searchableGamesWhere({ serverId, q }), gameFiltersWhere(filter)));
  return row!;
}

export type GamesCounts = Awaited<ReturnType<typeof getGamesCounts>>;
