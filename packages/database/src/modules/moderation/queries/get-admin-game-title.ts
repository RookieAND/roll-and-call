import { and, eq } from "drizzle-orm";

import { db } from "#db/client";
import { games } from "#db/schema";

import { isUuid } from "./is-uuid";

export async function getAdminGameTitle({ serverId, id }: { serverId: string; id: string }) {
  if (!isUuid(id)) return undefined;
  const [row] = await db
    .select({ title: games.title })
    .from(games)
    .where(and(eq(games.serverId, serverId), eq(games.id, id)));
  return row?.title;
}
