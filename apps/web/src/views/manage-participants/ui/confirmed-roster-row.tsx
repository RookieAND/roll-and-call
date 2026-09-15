import { Avatar, IconButton, Text, cn } from "@trpg/ui";
import { MoreHorizontal } from "lucide-react";

import type { ManagedMember } from "../model/managed-member";
import { ROSTER_ROW_CLASS } from "./roster-row-class";

// "4번이 대기인데 5번이 확정"인 이유(GM이 건너뛰고 올림)가 행 옆에 바로 보이게 한다.
export function ConfirmedRosterRow({
  member,
  waiting,
  isCoordinate,
  locked,
  onOpenMenu,
}: {
  member: ManagedMember;
  waiting: ManagedMember[];
  isCoordinate: boolean;
  locked: boolean;
  onOpenMenu: (member: ManagedMember) => void;
}) {
  const skippedRanks = waiting
    .filter((waitingMember) => waitingMember.applicationRank < member.applicationRank)
    .map((waitingMember) => waitingMember.applicationRank);
  const submittedLabel = member.hasAvailability ? "가능 시간 제출" : "가능 시간 미제출";
  const availability = isCoordinate ? submittedLabel : null;
  const skippedLabel =
    skippedRanks.length > 0 ? `${skippedRanks.join("·")}번을 건너뛰고 올림` : null;
  const note = [availability, skippedLabel].filter(Boolean).join(" · ");
  const noteClass = cn(
    "block truncate",
    isCoordinate && !member.hasAvailability && "text-warning-600",
  );

  return (
    <div className={ROSTER_ROW_CLASS}>
      <Text typography="code2" foreground="hint" className="w-5 shrink-0 text-center tabular-nums">
        {member.applicationRank}
      </Text>
      <Avatar src={member.avatarUrl} name={member.username} size="stack" />
      <div className="min-w-0 flex-1">
        <Text typography="subtitle2" className="block truncate">
          {member.username}
        </Text>
        {note && (
          <Text typography="body4" foreground="muted" className={noteClass}>
            {note}
          </Text>
        )}
      </div>
      {!locked && (
        <IconButton
          variant="outline"
          aria-label={`${member.username} 메뉴`}
          onClick={() => onOpenMenu(member)}
          className="h-11 w-11 shrink-0 rounded-[10px] border-gray-200 text-gray-600"
        >
          <MoreHorizontal size={16} aria-hidden />
        </IconButton>
      )}
    </div>
  );
}
