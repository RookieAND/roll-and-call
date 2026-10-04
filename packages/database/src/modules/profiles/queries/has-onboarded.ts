import { eq } from "drizzle-orm";
import { isNull } from "es-toolkit";

import { db } from "#/client";
import { profiles } from "#/schema";

// 행이 없으면 소개로 보내지 않는다.
export async function hasOnboarded(userId: string) {
  const [profile] = await db
    .select({ onboardedAt: profiles.onboardedAt })
    .from(profiles)
    .where(eq(profiles.id, userId));
  return !profile || !isNull(profile.onboardedAt);
}
