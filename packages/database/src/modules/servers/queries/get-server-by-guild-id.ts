import { eq } from "drizzle-orm";

import { db } from "#/client";
import { servers } from "#/schema";

export async function getServerByGuildId(guildId: string) {
  const [server] = await db.select().from(servers).where(eq(servers.discordGuildId, guildId));
  return server;
}
