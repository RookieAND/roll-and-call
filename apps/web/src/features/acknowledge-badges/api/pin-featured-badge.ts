"use server";

import { saveMemberFeaturedBadges } from "@roll-and-call/database/badges";
import { revalidatePath } from "next/cache";

import { FEATURED_BADGE_LIMIT, heldBadges } from "@/entities/badge";
import { type ActionResult } from "@/shared/api";
import { serverPath } from "@/shared/lib";
import { getActingMember, getProfile, getUserBadges, notMemberError } from "@/shared/server";

import { acknowledgeBadges } from "./acknowledge-badges";

export async function pinFeaturedBadge(key: string): Promise<ActionResult> {
  const member = await getActingMember();
  if (!member) {
    return { error: await notMemberError() };
  }
  const { server, user } = member;

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
  revalidatePath(serverPath({ slug: server.slug, path: "/me" }), "layout");
  revalidatePath(serverPath({ slug: server.slug, path: `/users/${user.id}` }), "layout");
  return {};
}
