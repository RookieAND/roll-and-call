import { and, not, type SQL } from "drizzle-orm";

import { GAME_STATUS_FILTER, GAME_TAB, type GamesFilter } from "#/modules/games/model/games-filter";

import { gameBucketSql } from "./game-bucket-sql";
import { gameFiltersWhere } from "./game-filters-where";
import { searchableGamesWhere } from "./searchable-games-where";

// 취소된 구인은 어느 탭에도 넣지 않는다.
export function recruitingGamesWhere({
  serverId,
  filter,
  now,
}: {
  serverId: string;
  filter: GamesFilter;
  now: Date;
}) {
  const { full, ended, live } = gameBucketSql({ now });
  const status = filter.status ?? GAME_STATUS_FILTER.all;
  const conditions: SQL[] = [searchableGamesWhere({ serverId, q: filter.q })];

  if (filter.tab === GAME_TAB.past) {
    conditions.push(not(live));
    if (status === GAME_STATUS_FILTER.closed) conditions.push(not(ended));
    if (status === GAME_STATUS_FILTER.ended) conditions.push(ended);
  } else {
    conditions.push(live);
    if (status === GAME_STATUS_FILTER.recruiting) conditions.push(not(full));
    if (status === GAME_STATUS_FILTER.waitlist) conditions.push(full);
  }

  const filters = gameFiltersWhere(filter);
  if (filters) conditions.push(filters);
  return and(...conditions);
}
