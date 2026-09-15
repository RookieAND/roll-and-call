import { Avatar, Button, Text } from "@trpg/ui";

import { PromoteButton } from "@/features/adjust-roster";

import type { ManagedMember } from "../model/managed-member";
import { ROSTER_ROW_CLASS } from "./roster-row-class";

export function WaitingRosterRow({
  gameId,
  member,
  isFull,
  locked,
  onSwap,
}: {
  gameId: string;
  member: ManagedMember;
  isFull: boolean;
  locked: boolean;
  onSwap: (member: ManagedMember) => void;
}) {
  return (
    <div className={ROSTER_ROW_CLASS}>
      <Text typography="code2" foreground="hint" className="w-5 shrink-0 text-center tabular-nums">
        {member.applicationRank}
      </Text>
      <Avatar src={member.avatarUrl} name={member.username} />
      <div className="min-w-0 flex-1">
        <Text typography="subtitle2" className="block truncate">
          {member.username}
        </Text>
        <Text typography="body4" foreground="muted" className="block">
          대기 {member.waitlistRank}번
        </Text>
      </div>
      {!locked &&
        (isFull ? (
          <Button variant="outline" size="sm" className="h-9" onClick={() => onSwap(member)}>
            교체
          </Button>
        ) : (
          <PromoteButton gameId={gameId} member={member} />
        ))}
    </div>
  );
}
