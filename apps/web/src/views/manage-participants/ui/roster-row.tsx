import { HStack, Text, cn } from "@roll-and-call/ui";
import { isNotNil } from "es-toolkit";
import type { ReactNode } from "react";

import { ProfileRow } from "@/entities/profile";
import { ServerLink } from "@/shared/ui";

import type { ManagedMember } from "../model/managed-member";

interface RosterRowProps {
  member: ManagedMember;
  rank?: number | null;
  note?: string;
  noteForeground?: "muted" | "hint" | "warning";
  badge?: ReactNode;
  dimmed?: boolean;
  action?: ReactNode;
}

export function RosterRow({
  member,
  rank,
  note,
  noteForeground = "muted",
  badge,
  dimmed = false,
  action,
}: RosterRowProps) {
  return (
    <HStack
      align="center"
      gap="125"
      className={cn("min-h-15 py-100 pr-075 pl-175", dimmed && "opacity-60")}
    >
      <ServerLink
        path={`/users/${member.userId}`}
        className="flex min-h-11 min-w-0 flex-1 items-center gap-125"
      >
        {isNotNil(rank) && (
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
          nameAddon={badge}
          subline={note}
          sublineForeground={noteForeground}
        />
      </ServerLink>
      {action}
    </HStack>
  );
}
