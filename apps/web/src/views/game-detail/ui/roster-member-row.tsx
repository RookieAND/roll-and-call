import { Badge } from "@trpg/ui";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

import type { RosterMember } from "@/entities/game";
import { EMPTY_BIO_TEXT, ProfileRow } from "@/entities/profile";

export type DetailRosterMember = RosterMember<{
  userId: string;
  user: { username: string; avatarUrl: string | null; bio: string | null } | null;
}>;

interface RosterMemberRowProps {
  userId: string;
  name: string | null | undefined;
  avatarUrl: string | null | undefined;
  bio: string | null | undefined;
  note?: string;
}

export function RosterMemberRow({ userId, name, avatarUrl, bio, note }: RosterMemberRowProps) {
  const bioForeground = bio ? "muted" : "hint";
  const noteBadge = note && (
    <Badge color="primary" className="shrink-0">
      {note}
    </Badge>
  );

  return (
    <Link
      href={`/u/${userId}`}
      className="flex min-h-14 items-center gap-125 py-100 transition-colors hover:bg-gray-50"
    >
      <ProfileRow
        name={name}
        avatarUrl={avatarUrl}
        nameAddon={noteBadge}
        subline={bio || EMPTY_BIO_TEXT}
        sublineForeground={bioForeground}
      />
      <ChevronRight size={17} className="flex-none text-gray-400" aria-hidden />
    </Link>
  );
}
