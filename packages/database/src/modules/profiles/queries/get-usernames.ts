import { inArray } from "drizzle-orm";

import { db } from "#/client";
import { profiles } from "#/schema";

export async function getUsernames(userIds: readonly string[]) {
  const rows = await db
    .select({ username: profiles.username })
    .from(profiles)
    .where(inArray(profiles.id, [...userIds]));
  return rows.map((row) => row.username);
}
