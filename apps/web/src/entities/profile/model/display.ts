import { z } from "zod";

import type { Profile } from "@/shared/server";

const text = z.string().optional().catch(undefined);
const metadataSchema = z.object({
  full_name: text,
  name: text,
  avatar_url: text,
  user_name: text,
  preferred_username: text,
});

interface DisplayUser {
  email?: string;
  user_metadata: Record<string, unknown>;
}

export function profileDisplay({ profile, user }: { profile?: Profile | null; user: DisplayUser }) {
  const metadata = metadataSchema.parse(user.user_metadata);
  return {
    name: profile?.username ?? metadata.full_name ?? metadata.name ?? user.email ?? "",
    avatar: profile?.avatarUrl ?? metadata.avatar_url ?? null,
    handle: metadata.user_name ?? metadata.preferred_username ?? null,
  };
}
