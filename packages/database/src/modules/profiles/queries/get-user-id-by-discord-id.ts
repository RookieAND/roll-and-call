import { eq } from "drizzle-orm";

import { db } from "#db/client";
import { profiles } from "#db/schema";

export async function getUserIdByDiscordId(discordId: string) {
  const [profile] = await db
    .select({ id: profiles.id })
    .from(profiles)
    .where(eq(profiles.discordId, discordId));
  return profile?.id;
}
