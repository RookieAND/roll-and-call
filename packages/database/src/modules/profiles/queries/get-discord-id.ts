import { eq } from "drizzle-orm";

import { db } from "../../../client";
import { profiles } from "../../../schema";

export async function getDiscordId(userId: string) {
  const [profile] = await db
    .select({ discordId: profiles.discordId })
    .from(profiles)
    .where(eq(profiles.id, userId));
  return profile?.discordId;
}
