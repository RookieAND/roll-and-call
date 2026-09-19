"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { AUTH_REQUIRED_MESSAGE, type ActionResult } from "@/shared/api";
import { db, getCurrentUser, profileMemos } from "@/shared/server";

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
  if (!memo) {
    await db
      .delete(profileMemos)
      .where(and(eq(profileMemos.ownerId, user.id), eq(profileMemos.targetId, targetId)));
  } else {
    await db
      .insert(profileMemos)
      .values({ ownerId: user.id, targetId, body: memo })
      .onConflictDoUpdate({
        target: [profileMemos.ownerId, profileMemos.targetId],
        set: { body: memo, updatedAt: new Date() },
      });
  }

  revalidatePath(`/u/${targetId}`);
  return { redirect: `/u/${targetId}` };
}
