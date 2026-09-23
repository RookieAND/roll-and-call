import "server-only";
import { games } from "@roll-and-call/database";
import { asc, desc, sql } from "drizzle-orm";

import { GAME_SORT, GAME_TAB, type GamesFilter } from "@/shared/api";

import { confirmedCountSql } from "./confirmed-count-sql";
import { gameBucketSql } from "./game-bucket-sql";

export function recruitingGamesOrderBy({ filter, now }: { filter: GamesFilter; now: Date }) {
  if (filter.tab === GAME_TAB.past) return desc(gameBucketSql({ now }).finishedAt);
  if (filter.sort === GAME_SORT.deadline) return asc(games.endDate);
  if (filter.sort === GAME_SORT.slots) return desc(sql`${games.maxPlayers} - ${confirmedCountSql}`);
  return desc(games.createdAt);
}
