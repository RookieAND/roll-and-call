"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { normalizeAvailability, type AvailabilityInterval } from "@/entities/profile";
import { AUTH_REQUIRED_MESSAGE, type ActionResult } from "@/shared/api";
import { db, getCurrentUser, profiles } from "@/shared/server";

export async function updateAvailability(intervals: AvailabilityInterval[]): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: AUTH_REQUIRED_MESSAGE };

  await db
    .update(profiles)
    .set({ availability: normalizeAvailability(intervals) })
    .where(eq(profiles.id, user.id));

  revalidatePath("/me");
  return { redirect: "/me/edit" };
}
