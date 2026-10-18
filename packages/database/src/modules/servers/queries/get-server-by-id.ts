import { eq } from "drizzle-orm";

import { db } from "#db/client";
import { servers } from "#db/schema";

export async function getServerById(serverId: string) {
  const [server] = await db.select().from(servers).where(eq(servers.id, serverId));
  return server;
}
