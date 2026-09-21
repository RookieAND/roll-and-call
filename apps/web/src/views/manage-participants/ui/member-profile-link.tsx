import { Avatar, HStack, Text } from "@trpg/ui";
import Link from "next/link";
import type { ReactNode } from "react";

import type { ManagedMember } from "../model/managed-member";
import { PreConfirmedTag } from "./pre-confirmed-tag";

interface MemberProfileLinkProps {
  member: ManagedMember;
  rank?: number | null;
  preConfirmed?: boolean;
  note: ReactNode;
}

// 행을 누르면 언제나 프로필이다. 명단 조작은 오른쪽 ⋯ 한 곳에만 둔다.
export function MemberProfileLink({ member, rank, preConfirmed, note }: MemberProfileLinkProps) {
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
        <HStack align="center" gap="075" render={<span />} className="min-w-0">
          <Text truncate typography="subtitle2">
            {member.username}
          </Text>
          {preConfirmed && <PreConfirmedTag />}
        </HStack>
        {note}
      </div>
    </Link>
  );
}
