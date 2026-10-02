import "server-only";
import { isPlatformAdmin } from "@roll-and-call/database/moderation";
import { cache } from "react";

import { createSupabaseServerClient } from "./create-supabase-server-client";

export interface SessionAccount {
  userId: string;
  discordId: string;
  nickname: string;
  platformAdmin: boolean;
}

// 서버와 무관한 로그인 계정. 서버 선택·로그인·권한 없음 화면과 서버별 역할 판별이 같이 쓴다.
export const getSessionAccount = cache(async (): Promise<SessionAccount | null> => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const metadata = user.user_metadata as Record<string, string | undefined>;
  const discordId = metadata.provider_id ?? "";
  return {
    userId: user.id,
    discordId,
    nickname: metadata.full_name ?? metadata.name ?? user.email ?? "",
    platformAdmin: Boolean(discordId) && isPlatformAdmin(discordId),
  };
});
