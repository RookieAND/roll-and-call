import type { User } from "@supabase/supabase-js";
import type { Profile } from "@/shared/server";

// 화면에 보일 이름·아바타·핸들. profiles 행이 우선, 없으면 Discord 메타데이터로 채운다.
export function profileDisplay({ profile, user }: { profile?: Profile | null; user: User }) {
  const meta = user.user_metadata as Record<string, string | undefined>;
  return {
    name: profile?.username ?? meta.full_name ?? meta.name ?? user.email ?? "",
    avatar: profile?.avatarUrl ?? meta.avatar_url ?? null,
    handle: meta.user_name ?? meta.preferred_username ?? null,
  };
}
