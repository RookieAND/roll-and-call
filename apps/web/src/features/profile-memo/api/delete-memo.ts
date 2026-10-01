"use server";

import { deleteProfileMemo } from "@roll-and-call/database/web";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { AUTH_REQUIRED_MESSAGE, type ActionResult } from "@/shared/api";
import { getCurrentServer, getCurrentUser } from "@/shared/server";

export async function deleteMemo(targetId: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: AUTH_REQUIRED_MESSAGE };

  const server = await getCurrentServer();
  await deleteProfileMemo({ serverId: server.id, ownerId: user.id, targetId });

  revalidatePath(`/u/${targetId}`);
  redirect(`/u/${targetId}`);
}
