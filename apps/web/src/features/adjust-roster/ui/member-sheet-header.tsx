import { ProfileRow } from "@/entities/profile";

import type { MemberSummary } from "../model/member-summary";
import { memberSheetSubline } from "./member-sheet-subline";

interface MemberSheetHeaderProps {
  member: MemberSummary;
  beforeDraw: boolean;
  started: boolean;
}

export function MemberSheetHeader({ member, beforeDraw, started }: MemberSheetHeaderProps) {
  const subline = memberSheetSubline({ member, beforeDraw, started });

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
