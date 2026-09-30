"use server";

import { and, eq, inArray } from "drizzle-orm";

import { AUTH_REQUIRED_MESSAGE, type ActionResult } from "@/shared/api";
import { db, getCurrentUser, userBadges } from "@/shared/server";

// 획득 시트를 닫으면 보여 준 뱃지만 알린 것으로 적는다. 그 사이 새로 받은 뱃지는 다음 방문에 뜬다.
export async function acknowledgeBadges(keys: string[]): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: AUTH_REQUIRED_MESSAGE };
  if (keys.length === 0) return {};

  await db
    .update(userBadges)
    .set({ notifiedAt: new Date() })
    .where(and(eq(userBadges.userId, user.id), inArray(userBadges.badgeKey, keys)));
  return {};
}
