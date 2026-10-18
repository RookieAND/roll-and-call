import { eq } from "drizzle-orm";

import { db } from "#db/client";
import { servers } from "#db/schema";

export async function getServerBySlug(slug: string) {
  const [server] = await db.select().from(servers).where(eq(servers.slug, slug));
  return server;
}
