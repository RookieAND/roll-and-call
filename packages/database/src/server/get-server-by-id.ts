import { eq } from "drizzle-orm";

import { db } from "../client";
import { servers } from "../schema";

export async function getServerById(serverId: string) {
  const [server] = await db.select().from(servers).where(eq(servers.id, serverId));
  return server;
}
