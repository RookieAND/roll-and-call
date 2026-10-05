"use server";

import { saveMemberFeaturedBadges } from "@roll-and-call/database/badges";
import { uniq } from "es-toolkit";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { FEATURED_BADGE_LIMIT, heldBadges, resolveFeaturedEntry } from "@/entities/badge";
import { type ActionResult } from "@/shared/api";
import { serverPath } from "@/shared/lib";
import { getActingMember, getUserBadges, notMemberError } from "@/shared/server";

export async function saveFeaturedBadges(keys: string[]): Promise<ActionResult> {
  const member = await getActingMember();
  if (!member) {
    return { error: await notMemberError() };
  }
  const { server, user } = member;

  const held = heldBadges(await getUserBadges(server.id, user.id));
  const featured = uniq(keys).filter((entry) => resolveFeaturedEntry(entry, held));
  if (featured.length > FEATURED_BADGE_LIMIT || featured.length !== keys.length) {
    return { error: "고를 수 없는 뱃지가 섞여 있습니다. 다시 골라 주세요." };
  }

  await saveMemberFeaturedBadges({
    serverId: server.id,
    userId: user.id,
    featuredBadges: featured,
  });
  revalidatePath(serverPath({ slug: server.slug, path: "/me" }), "layout");
  revalidatePath(serverPath({ slug: server.slug, path: `/users/${user.id}` }), "layout");
  redirect(serverPath({ slug: server.slug, path: "/me/badges" }));
}
