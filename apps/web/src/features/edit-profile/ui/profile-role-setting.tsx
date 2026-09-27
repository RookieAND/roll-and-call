"use client";

import { SegmentedControl } from "@roll-and-call/ui";
import { useState } from "react";

import { toast, useAction } from "@/shared/ui";

import { updateShowGmBadge } from "../api/update-show-gm-badge";

const PROFILE_ROLE = { player: "Player", gm: "GM" } as const;

interface ProfileRoleSettingProps {
  showGmBadge: boolean;
  className?: string;
}

export function ProfileRoleSetting({ showGmBadge, className }: ProfileRoleSettingProps) {
  const [role, setRole] = useState<string>(showGmBadge ? PROFILE_ROLE.gm : PROFILE_ROLE.player);
  const { run } = useAction();

  function select(nextRole: string) {
    const previousRole = role;
    setRole(nextRole);
    run(() => updateShowGmBadge(nextRole === PROFILE_ROLE.gm), {
      onError: (result) => {
        setRole(previousRole);
        toast.error(result.error);
      },
    });
  }

  return (
    <SegmentedControl.Root
      value={role}
      size="sm"
      onValueChange={(next) => select(next as string)}
      aria-label="프로필 역할"
      className={className}
    >
      <SegmentedControl.Item value={PROFILE_ROLE.player}>
        {PROFILE_ROLE.player}
      </SegmentedControl.Item>
      <SegmentedControl.Item value={PROFILE_ROLE.gm}>{PROFILE_ROLE.gm}</SegmentedControl.Item>
    </SegmentedControl.Root>
  );
}
