import { ProfileRow } from "@/entities/profile";

import type { MemberSummary } from "../model/member-summary";
import { memberSheetSubline } from "./member-sheet-subline";

interface MemberSheetHeaderProps {
  member: MemberSummary;
  isCoordinate: boolean;
  beforeDraw: boolean;
  started: boolean;
}

export function MemberSheetHeader({
  member,
  isCoordinate,
  beforeDraw,
  started,
}: MemberSheetHeaderProps) {
  const subline = memberSheetSubline({ member, isCoordinate, beforeDraw, started });

  return (
    <ProfileRow
      size="lg"
      name={member.username}
      avatarUrl={member.avatarUrl}
      subline={subline.text}
      sublineForeground={subline.foreground}
      className="flex-none border-b border-gray-100 pb-175"
    />
  );
}
