"use server";

import { saveAvatarUrl } from "@roll-and-call/database/profiles";
import { getDiscordAvatarUrl } from "@roll-and-call/discord";
import { revalidatePath } from "next/cache";

import { AUTH_REQUIRED_MESSAGE, type ActionResult } from "@/shared/api";
import { getCurrentUser } from "@/shared/server";

export async function refreshAvatar(): Promise<ActionResult & { avatarUrl?: string | null }> {
  const user = await getCurrentUser();
  if (!user) return { error: AUTH_REQUIRED_MESSAGE };

  const discordUserId = user.user_metadata.provider_id as string | undefined;
  if (!discordUserId) return { error: "Discord 계정 정보를 찾을 수 없습니다." };

  const avatarUrl = await getDiscordAvatarUrl(discordUserId);
  await saveAvatarUrl({ userId: user.id, avatarUrl });
  // 아바타는 모든 서버 프로필에 같이 보인다.
  revalidatePath("/[server]/me", "page");
  return { avatarUrl };
}
