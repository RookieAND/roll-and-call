"use server";

import { saveMemberShowBadges } from "@roll-and-call/database/profiles";
import { revalidatePath } from "next/cache";

import { AUTH_REQUIRED_MESSAGE, type ActionResult } from "@/shared/api";
import { serverPath } from "@/shared/lib";
import { getCurrentServer, getCurrentUser } from "@/shared/server";

export async function updateShowBadges(showBadges: boolean): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: AUTH_REQUIRED_MESSAGE };

  const server = await getCurrentServer();
  await saveMemberShowBadges({ serverId: server.id, userId: user.id, showBadges });

  revalidatePath(serverPath({ slug: server.slug, path: "/me" }));
  revalidatePath(serverPath({ slug: server.slug, path: `/u/${user.id}` }), "layout");
  return {};
}
