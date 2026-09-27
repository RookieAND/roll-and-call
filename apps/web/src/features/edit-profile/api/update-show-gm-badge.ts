"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { AUTH_REQUIRED_MESSAGE, type ActionResult } from "@/shared/api";
import { db, getCurrentUser, profiles } from "@/shared/server";

export async function updateShowGmBadge(showGmBadge: boolean): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: AUTH_REQUIRED_MESSAGE };

  await db.update(profiles).set({ showGmBadge }).where(eq(profiles.id, user.id));

  revalidatePath("/me");
  revalidatePath(`/u/${user.id}`);
  return {};
}
