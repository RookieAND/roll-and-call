"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { parseActionInput, type ActionResult } from "@/shared/api";
import { serverPath } from "@/shared/lib";
import {
  getActingMember,
  markAllNotificationsRead as markAllRead,
  notMemberError,
} from "@/shared/server";

import { readUpTo } from "../model/read-up-to";

const upToSchema = z.string().max(64);

// upTo는 화면이 목록을 읽은 시각이다. 그 뒤에 생긴 알림은 보지 않았으니 남긴다.
export async function markAllNotificationsRead(upTo: string): Promise<ActionResult> {
  const parsed = parseActionInput(upToSchema, upTo);
  if (!parsed.ok) return parsed.result;

  const member = await getActingMember();
  if (!member) return { error: await notMemberError() };
  const { server, user } = member;
  const now = new Date();
  await markAllRead({
    serverId: server.id,
    userId: user.id,
    upTo: readUpTo({ upTo, now }),
    now,
  });
  revalidatePath(serverPath({ slug: server.slug, path: "/notifications" }));
  return {};
}
