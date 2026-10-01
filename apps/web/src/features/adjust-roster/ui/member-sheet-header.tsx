import { availabilityNote } from "@/entities/game";
import { ProfileRow } from "@/entities/profile";

import type { MemberSummary } from "../model/member-summary";
import { queueLabel } from "./queue-label";

interface MemberSheetHeaderProps {
  member: MemberSummary;
  isCoordinate: boolean;
  beforeDraw: boolean;
}

export function MemberSheetHeader({ member, isCoordinate, beforeDraw }: MemberSheetHeaderProps) {
  const queue = queueLabel({ waitlistRank: member.waitlistRank, beforeDraw });
  const subline = isCoordinate ? `${queue} · ${availabilityNote(member.hasAvailability)}` : queue;
  const sublineForeground = isCoordinate && !member.hasAvailability ? "warning" : "muted";

  return (
    <ProfileRow
      size="lg"
      name={member.username}
      avatarUrl={member.avatarUrl}
      subline={subline}
      sublineForeground={sublineForeground}
      className="flex-none border-b border-gray-100 pb-175"
    />
  );
}
