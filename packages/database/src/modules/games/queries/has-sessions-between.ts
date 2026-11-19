import { and, sql } from "drizzle-orm";

import { db } from "#db/client";

import { firstRoundStartSql } from "./first-round-sql";
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
    where: and(
      sql`${firstRoundStartSql} >= ${from.toISOString()}::timestamptz`,
      sql`${firstRoundStartSql} < ${to.toISOString()}::timestamptz`,
      publicGamesWhere(serverId),
    ),
  });
  return row !== undefined;
}
