"use server";

import { saveMemberFeaturedBadges } from "@roll-and-call/database/web";
import { revalidatePath } from "next/cache";

import { FEATURED_BADGE_LIMIT, heldBadges } from "@/entities/badge";
import { AUTH_REQUIRED_MESSAGE, type ActionResult } from "@/shared/api";
import { getCurrentServer, getCurrentUser, getProfile, getUserBadges } from "@/shared/server";

import { acknowledgeBadges } from "./acknowledge-badges";

export async function pinFeaturedBadge(key: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: AUTH_REQUIRED_MESSAGE };

  const server = await getCurrentServer();
  const [profile, records] = await Promise.all([
    getProfile(server.id, user.id),
    getUserBadges(server.id, user.id),
  ]);
  if (!heldBadges(records).some((badge) => badge.key === key)) {
    return { error: "지금 달고 있는 뱃지가 아닙니다." };
  }
  const featured = [key, ...(profile?.featuredBadges ?? []).filter((other) => other !== key)].slice(
    0,
    FEATURED_BADGE_LIMIT,
  );
  await saveMemberFeaturedBadges({
    serverId: server.id,
    userId: user.id,
    featuredBadges: featured,
  });
  await acknowledgeBadges([key]);
  revalidatePath("/me", "layout");
  revalidatePath(`/u/${user.id}`, "layout");
  return {};
}
