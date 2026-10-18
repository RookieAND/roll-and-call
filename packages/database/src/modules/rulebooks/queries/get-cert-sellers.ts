import { eq } from "drizzle-orm";

import { db } from "#db/client";
import { certSellers } from "#db/schema";

export async function getCertSellers({ serverId }: { serverId: string }) {
  const rows = await db
    .select({ name: certSellers.name })
    .from(certSellers)
    .where(eq(certSellers.serverId, serverId))
    .orderBy(certSellers.createdAt);
  return rows.map((row) => row.name);
}
