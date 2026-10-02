"use server";

import { deleteProfileMemo } from "@roll-and-call/database/profiles";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { type ActionResult } from "@/shared/api";
import { serverPath } from "@/shared/lib";
import { getActingMember, notMemberError } from "@/shared/server";

export async function deleteMemo(targetId: string): Promise<ActionResult> {
  const member = await getActingMember();
  if (!member) {
    return { error: await notMemberError() };
  }
  const { server, user } = member;

  await deleteProfileMemo({ serverId: server.id, ownerId: user.id, targetId });

  const profilePath = serverPath({ slug: server.slug, path: `/users/${targetId}` });
  revalidatePath(profilePath);
  redirect(profilePath);
}
