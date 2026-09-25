"use client";

import { HStack, Tabs } from "@roll-and-call/ui";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";

import { TabCount } from "@/shared/ui";

import { POST_DETAIL_TAB, type PostDetailTab } from "../model/post-detail-tab";

interface PostDetailTabsProps {
  tab: PostDetailTab;
  unresolvedReportCount: number;
  memberCount: number;
  waitlistCount: number;
  reportPanel: ReactNode | null;
  contentPanel: ReactNode;
  memberPanel: ReactNode;
  waitlistPanel: ReactNode;
}

// 탭은 주소의 tab으로 기억한다. 신고가 없는 구인에는 신고 탭을 두지 않는다.
export function PostDetailTabs({
  tab,
  unresolvedReportCount,
  memberCount,
  waitlistCount,
  reportPanel,
  contentPanel,
  memberPanel,
  waitlistPanel,
}: PostDetailTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  return (
    <Tabs.Root
      value={tab}
      onValueChange={(value) => {
        const next = new URLSearchParams(searchParams);
        next.delete("page");
        next.set("tab", value);
        router.replace(`${pathname}?${next}`, { scroll: false });
      }}
    >
      <HStack align="center" className="border-b border-(--rc-color-border-subtle) px-150">
        <Tabs.List aria-label="구인 상세 보기" scrollable={false} className="border-b-0">
          {reportPanel ? (
            <Tabs.Trigger value={POST_DETAIL_TAB.reports}>
              신고
              <TabCount
                count={unresolvedReportCount}
                selected={tab === POST_DETAIL_TAB.reports}
                danger={unresolvedReportCount > 0}
              />
            </Tabs.Trigger>
          ) : null}
          <Tabs.Trigger value={POST_DETAIL_TAB.content}>구인 내용</Tabs.Trigger>
          <Tabs.Trigger value={POST_DETAIL_TAB.members}>
            참여자
            <TabCount count={memberCount} selected={tab === POST_DETAIL_TAB.members} />
          </Tabs.Trigger>
          <Tabs.Trigger value={POST_DETAIL_TAB.waitlist}>
            대기자
            <TabCount count={waitlistCount} selected={tab === POST_DETAIL_TAB.waitlist} />
          </Tabs.Trigger>
          <Tabs.Indicator />
        </Tabs.List>
      </HStack>
      {reportPanel ? (
        <Tabs.Panel value={POST_DETAIL_TAB.reports} className="pt-0">
          {reportPanel}
        </Tabs.Panel>
      ) : null}
      <Tabs.Panel value={POST_DETAIL_TAB.content} className="pt-0">
        {contentPanel}
      </Tabs.Panel>
      <Tabs.Panel value={POST_DETAIL_TAB.members} className="pt-0">
        {memberPanel}
      </Tabs.Panel>
      <Tabs.Panel value={POST_DETAIL_TAB.waitlist} className="pt-0">
        {waitlistPanel}
      </Tabs.Panel>
    </Tabs.Root>
  );
}
