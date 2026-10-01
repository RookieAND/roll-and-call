"use server";

import { saveMemberFeaturedBadges } from "@roll-and-call/database/badges";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { FEATURED_BADGE_LIMIT, heldBadges } from "@/entities/badge";
import { AUTH_REQUIRED_MESSAGE, type ActionResult } from "@/shared/api";
import { getCurrentServer, getCurrentUser, getUserBadges } from "@/shared/server";

export async function saveFeaturedBadges(keys: string[]): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: AUTH_REQUIRED_MESSAGE };

  const server = await getCurrentServer();
  const held = new Set(
    heldBadges(await getUserBadges(server.id, user.id)).map((badge) => badge.key),
  );
  const featured = [...new Set(keys)].filter((key) => held.has(key));
  if (featured.length > FEATURED_BADGE_LIMIT || featured.length !== keys.length) {
    return { error: "고를 수 없는 뱃지가 섞여 있습니다. 다시 골라 주세요." };
  }

  await saveMemberFeaturedBadges({
    serverId: server.id,
    userId: user.id,
    featuredBadges: featured,
  });
  revalidatePath("/me", "layout");
  revalidatePath(`/u/${user.id}`, "layout");
  redirect("/me/badges");
}
