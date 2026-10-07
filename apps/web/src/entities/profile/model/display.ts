import type { Profile } from "@/shared/server";

interface DisplayUser {
  email?: string;
  user_metadata: Record<string, unknown>;
}

export function profileDisplay({ profile, user }: { profile?: Profile | null; user: DisplayUser }) {
  const metadata = user.user_metadata as Record<string, string | undefined>;
  return {
    name: profile?.username ?? metadata.full_name ?? metadata.name ?? user.email ?? "",
    avatar: profile?.avatarUrl ?? metadata.avatar_url ?? null,
    handle: metadata.user_name ?? metadata.preferred_username ?? null,
  };
}
