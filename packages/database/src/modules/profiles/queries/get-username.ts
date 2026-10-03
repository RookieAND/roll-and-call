import { eq } from "drizzle-orm";

import { db } from "#/client";
import { profiles } from "#/schema";

export async function getUsername(userId: string) {
  const [profile] = await db
    .select({ username: profiles.username })
    .from(profiles)
    .where(eq(profiles.id, userId));
  return profile?.username;
}
