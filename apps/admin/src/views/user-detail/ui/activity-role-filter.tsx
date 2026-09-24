"use client";

import { SegmentedControl } from "@roll-and-call/ui";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { ACTIVITY_ROLE, type ActivityRole } from "../model/activity-role";

interface ActivityRoleFilterProps {
  role: ActivityRole;
}

export function ActivityRoleFilter({ role }: ActivityRoleFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  return (
    <SegmentedControl.Root
      size="sm"
      fullWidth={false}
      value={role}
      onValueChange={(value) => {
        const next = new URLSearchParams(searchParams);
        if (value === ACTIVITY_ROLE.all) next.delete("role");
        else next.set("role", value);
        router.replace(next.size ? `${pathname}?${next}` : pathname, { scroll: false });
      }}
      aria-label="활동 역할"
    >
      <SegmentedControl.Item value={ACTIVITY_ROLE.all}>전체</SegmentedControl.Item>
      <SegmentedControl.Item value={ACTIVITY_ROLE.hosted}>연 세션</SegmentedControl.Item>
      <SegmentedControl.Item value={ACTIVITY_ROLE.played}>참여 세션</SegmentedControl.Item>
    </SegmentedControl.Root>
  );
}
