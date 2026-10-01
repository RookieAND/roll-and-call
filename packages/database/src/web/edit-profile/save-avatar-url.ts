import { eq } from "drizzle-orm";

import { db } from "../../client";
import { profiles } from "../../schema";

export async function saveAvatarUrl({ userId, avatarUrl }: { userId: string; avatarUrl: string }) {
  await db.update(profiles).set({ avatarUrl }).where(eq(profiles.id, userId));
}
