import { MEMBER_ROLE, type MemberRole } from "@roll-and-call/database/servers/model";
import { Crown, Wrench } from "lucide-react";

const ROLE_MARK = {
  [MEMBER_ROLE.owner]: { Icon: Crown, label: "서버장" },
  [MEMBER_ROLE.staff]: { Icon: Wrench, label: "운영진" },
} as const;

interface ProfileRoleMarkProps {
  role: MemberRole;
}

export function ProfileRoleMark({ role }: ProfileRoleMarkProps) {
  const { Icon, label } = ROLE_MARK[role];
  return (
    <span role="img" aria-label={label} title={label} className="flex-none text-primary-ink">
      <Icon size={18} aria-hidden />
    </span>
  );
}
