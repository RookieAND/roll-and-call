import { Badge } from "@roll-and-call/ui";
import { ChevronRight } from "lucide-react";

import type { RosterMember } from "@/entities/game";
import { EMPTY_BIO_TEXT, ProfileRow } from "@/entities/profile";
import { ServerLink } from "@/shared/ui";

export type DetailRosterMember = RosterMember<{
  userId: string;
  user: { username: string; avatarUrl: string | null; bio: string | null } | null;
}>;

interface RosterMemberRowProps {
  userId: string;
  name: string | null | undefined;
  avatarUrl: string | null | undefined;
  bio: string | null | undefined;
  tags?: string[];
}

export function RosterMemberRow({ userId, name, avatarUrl, bio, tags = [] }: RosterMemberRowProps) {
  return (
    <ServerLink
      path={`/u/${userId}`}
      className="flex min-h-15 items-center gap-125 px-175 py-100 transition-colors hover:bg-gray-50"
    >
      <ProfileRow
        name={name}
        avatarUrl={avatarUrl}
        nameAddon={tags.map((tag) => (
          <Badge key={tag} colorPalette="primary" className="shrink-0">
            {tag}
          </Badge>
        ))}
        subline={bio || EMPTY_BIO_TEXT}
        sublineForeground="hint"
      />
      <ChevronRight size={17} className="flex-none text-hint" aria-hidden />
    </ServerLink>
  );
}
