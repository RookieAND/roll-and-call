import { Text, cn } from "@trpg/ui";
import type { ReactNode } from "react";

import type { ManagedMember } from "../model/managed-member";
import { MemberProfileLink } from "./member-profile-link";

// 행에서 읽는 것은 하나뿐이다. 어느 큐에 있는지는 위치가 이미 말해 준다.
export function RosterRow({
  member,
  rank,
  note,
  warn,
  action,
}: {
  member: ManagedMember;
  rank?: number | null;
  note?: string;
  warn?: boolean;
  action: ReactNode;
}) {
  return (
    <div className="flex min-h-14 items-center gap-150 border-t border-gray-100 px-150 py-100 first:border-t-0">
      <MemberProfileLink
        member={member}
        rank={rank}
        note={
          note && (
            <Text
              typography="body4"
              foreground="muted"
              className={cn("block truncate", warn && "text-warning-600")}
            >
              {note}
            </Text>
          )
        }
      />
      {action}
    </div>
  );
}
