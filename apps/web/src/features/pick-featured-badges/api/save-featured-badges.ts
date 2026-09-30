"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { FEATURED_BADGE_LIMIT, heldBadges } from "@/entities/badge";
import { AUTH_REQUIRED_MESSAGE, type ActionResult } from "@/shared/api";
import { db, getCurrentUser, getUserBadges, profiles } from "@/shared/server";

// 지금 달고 있는 뱃지만 고를 수 있다. 누른 순서를 그대로 저장한다.
export async function saveFeaturedBadges(keys: string[]): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: AUTH_REQUIRED_MESSAGE };

  const held = new Set(heldBadges(await getUserBadges(user.id)).map((badge) => badge.key));
  const featured = [...new Set(keys)].filter((key) => held.has(key));
  if (featured.length > FEATURED_BADGE_LIMIT || featured.length !== keys.length) {
    return { error: "고를 수 없는 뱃지가 섞여 있습니다. 다시 골라 주세요." };
  }

  await db.update(profiles).set({ featuredBadges: featured }).where(eq(profiles.id, user.id));
  revalidatePath("/me", "layout");
  revalidatePath(`/u/${user.id}`, "layout");
  redirect("/me/badges");
}
