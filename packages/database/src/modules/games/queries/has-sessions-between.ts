import { and, gte, lt } from "drizzle-orm";

import { db } from "#/client";
import { games } from "#/schema";

import { publicGamesWhere } from "./public-games-where";

export async function hasSessionsBetween({
  serverId,
  from,
  to,
}: {
  serverId: string;
  from: Date;
  to: Date;
}) {
  const row = await db.query.games.findFirst({
    columns: { id: true },
    where: and(gte(games.confirmedAt, from), lt(games.confirmedAt, to), publicGamesWhere(serverId)),
  });
  return row !== undefined;
}
