"use server";

import { saveMemberShowBadges } from "@roll-and-call/database/profiles";
import { revalidatePath } from "next/cache";

import { type ActionResult } from "@/shared/api";
import { serverPath } from "@/shared/lib";
import { getActingMember, notMemberError } from "@/shared/server";

export async function updateShowBadges(showBadges: boolean): Promise<ActionResult> {
  const member = await getActingMember();
  if (!member) {
    return { error: await notMemberError() };
  }
  const { server, user } = member;

  await saveMemberShowBadges({ serverId: server.id, userId: user.id, showBadges });

  revalidatePath(serverPath({ slug: server.slug, path: "/me" }));
  revalidatePath(serverPath({ slug: server.slug, path: `/u/${user.id}` }), "layout");
  return {};
}
