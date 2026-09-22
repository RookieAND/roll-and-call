import { HStack, Text } from "@trpg/ui";
import Link from "next/link";
import type { ReactNode } from "react";

import { ProfileRow } from "@/entities/profile";

import type { ManagedMember } from "../model/managed-member";

interface RosterRowProps {
  member: ManagedMember;
  rank?: number | null;
  note?: string;
  warn?: boolean;
  action: ReactNode;
}

// 행에서 읽는 것은 하나뿐이다. 어느 큐에 있는지는 위치가 이미 말해 준다.
// 행을 누르면 언제나 프로필이다. 명단 조작은 오른쪽 ⋯ 한 곳에만 둔다.
export function RosterRow({ member, rank, note, warn, action }: RosterRowProps) {
  const noteForeground = warn ? "warning" : "muted";

  return (
    <HStack
      align="center"
      gap="150"
      className="min-h-14 border-t border-gray-100 px-150 py-100 first:border-t-0"
    >
      <Link
        href={`/u/${member.userId}`}
        className="flex min-h-11 min-w-0 flex-1 items-center gap-150"
      >
        {rank != null && (
          <Text numeric typography="code2" foreground="hint" className="w-5 shrink-0 text-center">
            {rank}
          </Text>
        )}
        <ProfileRow
          name={member.username}
          avatarUrl={member.avatarUrl}
          subline={note}
          sublineForeground={noteForeground}
        />
      </Link>
      {action}
    </HStack>
  );
}
