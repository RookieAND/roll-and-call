import { Avatar, Badge, Text } from "@trpg/ui";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

import type { RosterMember } from "@/entities/game";

export type DetailRosterMember = RosterMember<{
  userId: string;
  user: { username: string; avatarUrl: string | null; bio: string | null } | null;
}>;

const NO_BIO = "한 줄 소개 없음";

export function RosterMemberRow({
  userId,
  name,
  avatarUrl,
  bio,
  note,
}: {
  userId: string;
  name: string | null | undefined;
  avatarUrl: string | null | undefined;
  bio: string | null | undefined;
  note?: string;
}) {
  return (
    <Link
      href={`/u/${userId}`}
      className="flex min-h-14 items-center gap-2.5 py-2 transition-colors hover:bg-gray-50"
    >
      <Avatar src={avatarUrl} name={name} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <Text truncate typography="subtitle1">
            {name ?? "?"}
          </Text>
          {note && (
            <Badge color="primary" className="shrink-0">
              {note}
            </Badge>
          )}
        </div>
        <Text truncate typography="body4" foreground={bio ? "muted" : "hint"}>
          {bio || NO_BIO}
        </Text>
      </div>
      <ChevronRight size={17} className="flex-none text-gray-400" aria-hidden />
    </Link>
  );
}
