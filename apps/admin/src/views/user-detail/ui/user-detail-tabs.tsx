"use client";

import { Tabs } from "@roll-and-call/ui";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";

import { USER_DETAIL_TAB, type UserDetailTab } from "../model/user-detail-tab";

interface UserDetailTabsProps {
  tab: UserDetailTab;
  activityPanel: ReactNode;
  certPanel: ReactNode;
  noShowPanel: ReactNode;
  memoPanel: ReactNode;
}

// 탭은 주소의 tab으로 기억한다. 탭을 바꾸면 활동 탭 전용 role은 지운다.
export function UserDetailTabs({
  tab,
  activityPanel,
  certPanel,
  noShowPanel,
  memoPanel,
}: UserDetailTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  return (
    <Tabs.Root
      value={tab}
      onValueChange={(value) => {
        const next = new URLSearchParams(searchParams);
        next.delete("page");
        next.delete("role");
        if (value === USER_DETAIL_TAB.activity) next.delete("tab");
        else next.set("tab", value);
        router.replace(next.size ? `${pathname}?${next}` : pathname, { scroll: false });
      }}
    >
      <div className="border-b border-gray-200 bg-surface px-200">
        <Tabs.List aria-label="유저 상세 보기" scrollable={false} className="border-b-0">
          <Tabs.Trigger value={USER_DETAIL_TAB.activity}>활동</Tabs.Trigger>
          <Tabs.Trigger value={USER_DETAIL_TAB.cert}>룰북 인증</Tabs.Trigger>
          <Tabs.Trigger value={USER_DETAIL_TAB.noShow}>불참 기록</Tabs.Trigger>
          <Tabs.Trigger value={USER_DETAIL_TAB.memo}>운영진 메모</Tabs.Trigger>
          <Tabs.Indicator />
        </Tabs.List>
      </div>
      <Tabs.Panel value={USER_DETAIL_TAB.activity} className="p-200">
        {activityPanel}
      </Tabs.Panel>
      <Tabs.Panel value={USER_DETAIL_TAB.cert} className="p-200">
        {certPanel}
      </Tabs.Panel>
      <Tabs.Panel value={USER_DETAIL_TAB.noShow} className="p-200">
        {noShowPanel}
      </Tabs.Panel>
      <Tabs.Panel value={USER_DETAIL_TAB.memo} className="p-200">
        {memoPanel}
      </Tabs.Panel>
    </Tabs.Root>
  );
}
