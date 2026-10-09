"use server";

import { saveMemberShowBadges } from "@roll-and-call/database/profiles";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { parseActionInput, type ActionResult } from "@/shared/api";
import { serverPath } from "@/shared/lib";
import { getActingMember, notMemberError } from "@/shared/server";

const showBadgesSchema = z.boolean();

export async function updateShowBadges(showBadges: boolean): Promise<ActionResult> {
  const parsed = parseActionInput(showBadgesSchema, showBadges);
  if (!parsed.ok) return parsed.result;

  const member = await getActingMember();
  if (!member) {
    return { error: await notMemberError() };
  }
  const { server, user } = member;

  await saveMemberShowBadges({ serverId: server.id, userId: user.id, showBadges });

  revalidatePath(serverPath({ slug: server.slug, path: "/me" }));
  revalidatePath(serverPath({ slug: server.slug, path: `/users/${user.id}` }), "layout");
  return {};
}
