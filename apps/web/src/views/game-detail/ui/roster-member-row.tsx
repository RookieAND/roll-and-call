import { Avatar, Badge, HStack, Text } from "@trpg/ui";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

import type { RosterMember } from "@/entities/game";

import { EmptyMemberBio } from "./empty-member-bio";
import { MemberBio } from "./member-bio";

export type DetailRosterMember = RosterMember<{
  userId: string;
  user: { username: string; avatarUrl: string | null; bio: string | null } | null;
}>;

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
      className="flex min-h-14 items-center gap-125 py-100 transition-colors hover:bg-gray-50"
    >
      <Avatar src={avatarUrl} name={name} />
      <div className="min-w-0 flex-1">
        <HStack align="center" gap="075">
          <Text truncate typography="subtitle1">
            {name ?? "?"}
          </Text>
          {note && (
            <Badge color="primary" className="shrink-0">
              {note}
            </Badge>
          )}
        </HStack>
        {bio ? <MemberBio bio={bio} /> : <EmptyMemberBio />}
      </div>
      <ChevronRight size={17} className="flex-none text-gray-400" aria-hidden />
    </Link>
  );
}
