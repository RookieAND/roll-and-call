"use server";

import { deleteProfileMemo, saveProfileMemo } from "@roll-and-call/database/profiles";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { AUTH_REQUIRED_MESSAGE, type ActionResult } from "@/shared/api";
import { serverPath } from "@/shared/lib";
import { getCurrentServer, getCurrentUser } from "@/shared/server";

import { MEMO_MAX_LENGTH } from "../model/memo-form";

export async function saveMemo({
  targetId,
  body,
}: {
  targetId: string;
  body: string;
}): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: AUTH_REQUIRED_MESSAGE };
  if (targetId === user.id) return { error: "자신에게는 메모를 쓸 수 없습니다." };

  const memo = body.trim().slice(0, MEMO_MAX_LENGTH);
  const server = await getCurrentServer();
  const memoKey = { serverId: server.id, ownerId: user.id, targetId };
  if (!memo) {
    await deleteProfileMemo(memoKey);
  } else {
    await saveProfileMemo({ ...memoKey, body: memo });
  }

  const profilePath = serverPath({ slug: server.slug, path: `/u/${targetId}` });
  revalidatePath(profilePath);
  redirect(profilePath);
}
