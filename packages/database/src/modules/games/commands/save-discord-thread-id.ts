import { and, eq } from "drizzle-orm";

import { db } from "../../../client";
import { games } from "../../../schema";

export async function saveDiscordThreadId({
  serverId,
  gameId,
  threadId,
}: {
  serverId: string;
  gameId: string;
  threadId: string;
}) {
  await db
    .update(games)
    .set({ discordThreadId: threadId })
    .where(and(eq(games.serverId, serverId), eq(games.id, gameId)));
}
