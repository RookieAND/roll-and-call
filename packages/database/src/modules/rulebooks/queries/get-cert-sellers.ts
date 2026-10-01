import { db } from "../../../client";
import { certSellers } from "../../../schema";

export async function getCertSellers() {
  const rows = await db
    .select({ name: certSellers.name })
    .from(certSellers)
    .orderBy(certSellers.createdAt);
  return rows.map((row) => row.name);
}
