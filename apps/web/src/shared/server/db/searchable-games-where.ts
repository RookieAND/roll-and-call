import "server-only";
import { games } from "@roll-and-call/database";
import { and, ilike, or, type SQL } from "drizzle-orm";

import { publicGamesWhere } from "./public-games-where";

export function searchableGamesWhere({ q }: { q: string | undefined }) {
  const conditions: SQL[] = [publicGamesWhere];
  if (q) conditions.push(or(ilike(games.title, `%${q}%`), ilike(games.rule, `%${q}%`))!);
  return and(...conditions)!;
}
