import type { AttendanceStage } from "../model/attendance-stage";
import type { ManagedMember } from "../model/managed-member";
import { AttendanceBadge } from "./attendance-badge";
import { MemberMenuButton } from "./member-menu-button";

interface RosterRowActionProps {
  member: ManagedMember;
  attendanceStage: AttendanceStage | null;
  locked: boolean;
  onOpenMenu: (member: ManagedMember) => void;
}

export function RosterRowAction({
  member,
  attendanceStage,
  locked,
  onOpenMenu,
}: RosterRowActionProps) {
  if (attendanceStage) return <AttendanceBadge stage={attendanceStage} absent={member.absent} />;
  if (locked) return null;
  return <MemberMenuButton username={member.username} onClick={() => onOpenMenu(member)} />;
}
