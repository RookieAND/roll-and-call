"use server";

import { copyMemberProfile } from "@roll-and-call/database/profiles";
import { revalidatePath } from "next/cache";

import type { ActionResult } from "@/shared/api";
import { serverPath } from "@/shared/lib";
import { getActingMember, notMemberError } from "@/shared/server";

export async function importMemberProfile({
  fromServerId,
}: {
  fromServerId: string;
}): Promise<ActionResult> {
  const member = await getActingMember();
  if (!member) return { error: await notMemberError() };

  const { server, user } = member;
  if (fromServerId === server.id) return { error: "다른 서버를 골라 주세요." };

  const copied = await copyMemberProfile({ serverId: server.id, userId: user.id, fromServerId });
  if (!copied) return { error: "가져올 프로필을 찾지 못했어요." };

  revalidatePath(serverPath({ slug: server.slug, path: "/me" }));
  return {};
}
