"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { AUTH_REQUIRED_MESSAGE, type ActionResult } from "@/shared/api";
import { db, getCurrentUser, profileMemos } from "@/shared/server";

export async function deleteMemo(targetId: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: AUTH_REQUIRED_MESSAGE };

  await db
    .delete(profileMemos)
    .where(and(eq(profileMemos.ownerId, user.id), eq(profileMemos.targetId, targetId)));

  revalidatePath(`/u/${targetId}`);
  return { redirect: `/u/${targetId}` };
}
