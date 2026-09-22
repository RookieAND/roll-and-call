import "server-only";
import { games } from "@roll-and-call/database";
import { asc, desc, sql } from "drizzle-orm";

import { GAME_SORT, type GameSort } from "@/shared/api";

import { confirmedCountSql } from "./confirmed-count-sql";

export function recruitingGamesOrderBy(sort: GameSort | undefined) {
  if (sort === GAME_SORT.deadline) return asc(games.endDate);
  if (sort === GAME_SORT.slots) return desc(sql`${games.maxPlayers} - ${confirmedCountSql}`);
  return desc(games.createdAt);
}
