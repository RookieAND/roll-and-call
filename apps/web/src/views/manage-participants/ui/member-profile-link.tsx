import { Avatar, Text } from "@trpg/ui";
import Link from "next/link";
import type { ReactNode } from "react";

import type { ManagedMember } from "../model/managed-member";

// 행을 누르면 언제나 프로필이다. 명단 조작은 오른쪽 ⋯ 한 곳에만 둔다.
export function MemberProfileLink({
  member,
  rank,
  note,
}: {
  member: ManagedMember;
  rank?: number | null;
  note: ReactNode;
}) {
  return (
    <Link
      href={`/u/${member.userId}`}
      className="flex min-h-11 min-w-0 flex-1 items-center gap-150"
    >
      {rank != null && (
        <Text numeric typography="code2" foreground="hint" className="w-5 shrink-0 text-center">
          {rank}
        </Text>
      )}
      <Avatar src={member.avatarUrl} name={member.username} size="stack" />
      <div className="min-w-0 flex-1">
        <Text truncate typography="subtitle2">
          {member.username}
        </Text>
        {note}
      </div>
    </Link>
  );
}
