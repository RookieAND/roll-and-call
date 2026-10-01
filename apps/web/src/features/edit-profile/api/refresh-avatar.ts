"use server";

import { saveAvatarUrl } from "@roll-and-call/database/profiles";
import { revalidatePath } from "next/cache";

import { AUTH_REQUIRED_MESSAGE, type ActionResult } from "@/shared/api";
import { getCurrentUser } from "@/shared/server";

export async function refreshAvatar(): Promise<ActionResult & { avatarUrl?: string }> {
  const user = await getCurrentUser();
  if (!user) return { error: AUTH_REQUIRED_MESSAGE };

  const avatarUrl = user.user_metadata.avatar_url as string | undefined;
  if (!avatarUrl) return { error: "Discord 아바타 정보를 찾을 수 없습니다." };

  await saveAvatarUrl({ userId: user.id, avatarUrl });
  revalidatePath("/me");
  return { avatarUrl };
}
