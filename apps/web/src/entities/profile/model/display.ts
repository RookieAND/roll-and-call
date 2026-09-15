import type { User } from "@supabase/supabase-js";

import type { Profile } from "@/shared/server";

export function profileDisplay({ profile, user }: { profile?: Profile | null; user: User }) {
  const metadata = user.user_metadata as Record<string, string | undefined>;
  return {
    name: profile?.username ?? metadata.full_name ?? metadata.name ?? user.email ?? "",
    avatar: profile?.avatarUrl ?? metadata.avatar_url ?? null,
    handle: metadata.user_name ?? metadata.preferred_username ?? null,
  };
}
