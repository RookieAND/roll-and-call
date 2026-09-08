"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/shared/api";
import { createSupabaseServerClient, db, profiles } from "@/shared/server";

// Discord 로그인 메타데이터의 아바타 URL을 profiles에 다시 반영한다.
export async function refreshAvatar(): Promise<ActionResult & { avatarUrl?: string }> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "로그인이 필요합니다." };

  const avatarUrl = user.user_metadata.avatar_url as string | undefined;
  if (!avatarUrl) return { error: "Discord 아바타 정보를 찾을 수 없습니다." };

  await db.update(profiles).set({ avatarUrl }).where(eq(profiles.id, user.id));
  revalidatePath("/me");
  return { avatarUrl };
}
