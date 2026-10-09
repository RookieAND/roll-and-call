"use client";

import { Tabs } from "@roll-and-call/ui";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  isMembershipStatus,
  MEMBERSHIP_LABEL,
  MEMBERSHIP_STATUS,
  type MembershipStatus,
} from "@/shared/lib";
import { TabCount } from "@/shared/ui";

const MEMBERSHIPS = Object.values(MEMBERSHIP_STATUS);

interface MembershipTabsProps {
  value: MembershipStatus;
  counts?: Record<MembershipStatus, number>;
  disabled?: boolean;
}

// 멤버십 상태를 먼저 고른다. 빠른 필터와 검색어는 그대로 두고 쪽 번호만 지운다.
export function MembershipTabs({ value, counts, disabled }: MembershipTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const change = (membership: MembershipStatus) => {
    const next = new URLSearchParams(searchParams);
    next.delete("page");
    if (membership === MEMBERSHIP_STATUS.active) next.delete("membership");
    else next.set("membership", membership);
    router.replace(next.size ? `${pathname}?${next}` : pathname, { scroll: false });
  };
  return (
    <Tabs.Root
      data-full-bleed
      value={value}
      onValueChange={(next) => {
        if (isMembershipStatus(next)) change(next);
      }}
    >
      <Tabs.List
        aria-label="유저 멤버십 상태"
        scrollable={false}
        className="border-b border-gray-200 bg-surface px-page"
      >
        {MEMBERSHIPS.map((membership) => (
          <Tabs.Trigger key={membership} value={membership} disabled={disabled}>
            {MEMBERSHIP_LABEL[membership]}
            {counts && <TabCount count={counts[membership]} selected={value === membership} />}
          </Tabs.Trigger>
        ))}
        <Tabs.Indicator />
      </Tabs.List>
    </Tabs.Root>
  );
}
