"use server";

import { saveMemberAvailability } from "@roll-and-call/database/web";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { normalizeAvailability, type AvailabilityInterval } from "@/entities/profile";
import { AUTH_REQUIRED_MESSAGE, type ActionResult } from "@/shared/api";
import { getCurrentServer, getCurrentUser } from "@/shared/server";

export async function updateAvailability(intervals: AvailabilityInterval[]): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: AUTH_REQUIRED_MESSAGE };

  const server = await getCurrentServer();
  await saveMemberAvailability({
    serverId: server.id,
    userId: user.id,
    availability: normalizeAvailability(intervals),
  });

  revalidatePath("/me");
  redirect("/me/edit");
}
