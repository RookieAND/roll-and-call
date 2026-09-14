"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db, getCurrentUser, profiles } from "@/shared/server";
import type { ActionResult } from "@/shared/api";

// GM 계정 설정: 세션이 확정되면 세션 채널을 자동으로 연다. 앞으로의 모든 구인에 적용된다.
export async function updateDiscordAutoOpen(enabled: boolean): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: "로그인이 필요합니다." };

  await db.update(profiles).set({ discordAutoOpen: enabled }).where(eq(profiles.id, user.id));
  revalidatePath("/me/discord");
  revalidatePath("/me");
  return {};
}
