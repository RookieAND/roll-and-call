import { and, eq, isNull, sql } from "drizzle-orm";

import { db } from "#/client";
import { profiles } from "#/schema";

// 처음 본 시각만 남긴다. 두 번 불러도 바뀌지 않는다.
export async function markOnboarded(userId: string) {
  await db
    .update(profiles)
    .set({ onboardedAt: sql`now()` })
    .where(and(eq(profiles.id, userId), isNull(profiles.onboardedAt)));
}
