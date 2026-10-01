import { eq } from "drizzle-orm";

import { db } from "../../../client";
import { servers } from "../../../schema";

export async function getServerBySlug(slug: string) {
  const [server] = await db.select().from(servers).where(eq(servers.slug, slug));
  return server;
}
