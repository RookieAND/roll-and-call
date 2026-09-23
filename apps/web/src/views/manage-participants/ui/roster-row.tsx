import { HStack, Text } from "@roll-and-call/ui";
import Link from "next/link";
import type { ReactNode } from "react";

import { ProfileRow } from "@/entities/profile";

import type { ManagedMember } from "../model/managed-member";

interface RosterRowProps {
  member: ManagedMember;
  rank?: number | null;
  note?: string;
  noteForeground?: "muted" | "hint" | "warning";
  action: ReactNode;
}

// 행에서 읽는 것은 하나뿐이다. 어느 큐에 있는지는 위치가 이미 말해 준다.
// 행을 누르면 언제나 프로필이다. 명단 조작은 오른쪽 ⋮ 한 곳에만 둔다.
export function RosterRow({
  member,
  rank,
  note,
  noteForeground = "muted",
  action,
}: RosterRowProps) {
  return (
    <HStack align="center" gap="125" className="min-h-15 py-100 pr-075 pl-175">
      <Link
        href={`/u/${member.userId}`}
        className="flex min-h-11 min-w-0 flex-1 items-center gap-125"
      >
        {rank != null && (
          <Text
            numeric
            typography="body4"
            weight="extrabold"
            foreground="hint"
            className="w-3.5 shrink-0"
          >
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
