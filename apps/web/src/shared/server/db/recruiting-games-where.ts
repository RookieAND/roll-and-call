import "server-only";
import { and, not, type SQL } from "drizzle-orm";

import { GAME_STATUS_FILTER, GAME_TAB, type GamesFilter } from "@/shared/api";

import { gameBucketSql } from "./game-bucket-sql";
import { searchableGamesWhere } from "./searchable-games-where";

export function recruitingGamesWhere({ filter, now }: { filter: GamesFilter; now: Date }) {
  const { full, ended, live } = gameBucketSql({ now });
  const conditions: SQL[] = [searchableGamesWhere({ q: filter.q })];

  if (filter.tab === GAME_TAB.past) {
    conditions.push(not(live));
    if (filter.status === GAME_STATUS_FILTER.closed) conditions.push(not(ended));
    if (filter.status === GAME_STATUS_FILTER.ended) conditions.push(ended);
  } else {
    conditions.push(live);
    if (filter.status === GAME_STATUS_FILTER.recruiting) conditions.push(not(full));
    if (filter.status === GAME_STATUS_FILTER.waitlist) conditions.push(full);
  }
  return and(...conditions);
}
