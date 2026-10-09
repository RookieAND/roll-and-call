"use server";

import { revalidatePath } from "next/cache";

import { idSchema, parseActionInput, type ActionResult } from "@/shared/api";
import { serverPath } from "@/shared/lib";
import { getActingMember, markNotificationRead as markRead, notMemberError } from "@/shared/server";

// 이미 읽었거나 없는 줄이어도 성공이다. 다른 탭에서 먼저 읽었을 수 있다.
export async function markNotificationRead(notificationId: string): Promise<ActionResult> {
  const parsed = parseActionInput(idSchema, notificationId);
  if (!parsed.ok) return parsed.result;

  const member = await getActingMember();
  if (!member) return { error: await notMemberError() };
  const { server, user } = member;
  await markRead({ serverId: server.id, userId: user.id, notificationId });
  revalidatePath(serverPath({ slug: server.slug, path: "/notifications" }));
  return {};
}
