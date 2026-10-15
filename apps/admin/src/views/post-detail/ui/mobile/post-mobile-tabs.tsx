"use client";

import { Tabs } from "@roll-and-call/ui";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";

import { TabCount } from "@/shared/ui";

import { POST_DETAIL_TAB, type PostDetailTab } from "../../model/post-detail-tab";

interface PostMobileTabsProps {
  tab: PostDetailTab;
  memberCount: number;
  waitlistCount: number;
  children: ReactNode;
}

// 한 줄 탭. 고른 탭의 내용만 서버가 그려 children으로 넘긴다.
export function PostMobileTabs({ tab, memberCount, waitlistCount, children }: PostMobileTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  return (
    <Tabs.Root
      value={tab}
      onValueChange={(value) => {
        const next = new URLSearchParams(searchParams);
        next.set("tab", value);
        router.replace(`${pathname}?${next}`, { scroll: false });
      }}
    >
      <Tabs.List aria-label="구인 상세" className="bg-surface px-200 [&>button]:flex-1">
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
      <Tabs.Panel value={tab} className="pt-0">
        {children}
      </Tabs.Panel>
    </Tabs.Root>
  );
}
