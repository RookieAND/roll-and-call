"use client";

import { SegmentedControl } from "@roll-and-call/ui";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { MEMBERSHIP_LABEL, MEMBERSHIP_STATUS, type MembershipStatus } from "@/shared/lib";

const MEMBERSHIPS = Object.values(MEMBERSHIP_STATUS);

interface MembershipSegmentProps {
  value: MembershipStatus;
  bannedCount?: number;
  disabled?: boolean;
}

// 멤버십 상태를 먼저 고른다. 빠른 필터와 검색어는 그대로 두고 쪽 번호만 지운다. 차단됨은 0이 아닐 때 건수를 붙인다.
export function MembershipSegment({ value, bannedCount = 0, disabled }: MembershipSegmentProps) {
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
  const label = (membership: MembershipStatus) =>
    membership === MEMBERSHIP_STATUS.banned && bannedCount > 0
      ? `${MEMBERSHIP_LABEL[membership]} ${bannedCount}`
      : MEMBERSHIP_LABEL[membership];
  return (
    <SegmentedControl.Root
      value={value}
      onValueChange={(next) => change(next as MembershipStatus)}
      aria-label="멤버십 상태"
      fullWidth={false}
      disabled={disabled}
      className="shrink-0"
    >
      {MEMBERSHIPS.map((membership) => (
        <SegmentedControl.Item key={membership} value={membership}>
          {label(membership)}
        </SegmentedControl.Item>
      ))}
    </SegmentedControl.Root>
  );
}
