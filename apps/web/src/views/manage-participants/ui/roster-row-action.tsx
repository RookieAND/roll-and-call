import { isNull } from "es-toolkit";

import type { ManagedMember } from "../model/managed-member";
import { MarkAbsentButton } from "./mark-absent-button";
import { MemberMenuButton } from "./member-menu-button";

interface RosterRowActionProps {
  member: ManagedMember;
  started: boolean;
  onOpenMenu: (member: ManagedMember) => void;
  onMarkAbsent: (member: ManagedMember) => void;
}

// 세션 시작 뒤 확정 참여자 줄은 메뉴 대신 불참으로 내보내기를 바로 연다. 내보낸 사람 줄에는 동작이 없다.
export function RosterRowAction({
  member,
  started,
  onOpenMenu,
  onMarkAbsent,
}: RosterRowActionProps) {
  if (member.removed) return null;
  if (started && isNull(member.waitlistRank)) {
    return <MarkAbsentButton username={member.username} onClick={() => onMarkAbsent(member)} />;
  }
  return <MemberMenuButton username={member.username} onClick={() => onOpenMenu(member)} />;
}
