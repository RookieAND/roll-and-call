import "server-only";
import { certSellers, db } from "@roll-and-call/database";

export async function getCertSellers() {
  const rows = await db
    .select({ name: certSellers.name })
    .from(certSellers)
    .orderBy(certSellers.createdAt);
  return rows.map((row) => row.name);
}
