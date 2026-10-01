"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { FEATURED_BADGE_LIMIT, heldBadges } from "@/entities/badge";
import { AUTH_REQUIRED_MESSAGE, type ActionResult } from "@/shared/api";
import { db, getCurrentUser, getProfile, getUserBadges, profiles } from "@/shared/server";

import { acknowledgeBadges } from "./acknowledge-badges";

export async function pinFeaturedBadge(key: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: AUTH_REQUIRED_MESSAGE };

  const [profile, records] = await Promise.all([getProfile(user.id), getUserBadges(user.id)]);
  if (!heldBadges(records).some((badge) => badge.key === key)) {
    return { error: "지금 달고 있는 뱃지가 아닙니다." };
  }
  const featured = [key, ...(profile?.featuredBadges ?? []).filter((other) => other !== key)].slice(
    0,
    FEATURED_BADGE_LIMIT,
  );
  await db.update(profiles).set({ featuredBadges: featured }).where(eq(profiles.id, user.id));
  await acknowledgeBadges([key]);
  revalidatePath("/me", "layout");
  revalidatePath(`/u/${user.id}`, "layout");
  return {};
}
