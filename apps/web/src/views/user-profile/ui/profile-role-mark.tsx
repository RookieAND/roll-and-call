"use client";

import { MEMBER_ROLE, type MemberRole } from "@roll-and-call/database/servers/model";
import { Tooltip } from "@roll-and-call/ui";
import { Crown, Wrench } from "lucide-react";

const ROLE_MARK = {
  [MEMBER_ROLE.owner]: { Icon: Crown, label: "소유주" },
  [MEMBER_ROLE.staff]: { Icon: Wrench, label: "관리자" },
} as const;

interface ProfileRoleMarkProps {
  role: MemberRole;
}

export function ProfileRoleMark({ role }: ProfileRoleMarkProps) {
  const { Icon, label } = ROLE_MARK[role];
  return (
    <Tooltip content={label}>
      <span role="img" aria-label={label} tabIndex={0} className="flex-none text-primary-ink">
        <Icon size={18} aria-hidden />
      </span>
    </Tooltip>
  );
}
