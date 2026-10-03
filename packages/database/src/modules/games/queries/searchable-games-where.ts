import { and, ilike, or, type SQL } from "drizzle-orm";

import { games } from "#/schema";

import { publicGamesWhere } from "./public-games-where";

export function searchableGamesWhere({ serverId, q }: { serverId: string; q: string | undefined }) {
  const conditions: SQL[] = [publicGamesWhere(serverId)];
  if (q) conditions.push(or(ilike(games.title, `%${q}%`), ilike(games.rule, `%${q}%`))!);
  return and(...conditions)!;
}
