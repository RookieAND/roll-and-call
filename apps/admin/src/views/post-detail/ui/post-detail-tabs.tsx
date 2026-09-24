"use client";

import { HStack, Tabs, Text } from "@roll-and-call/ui";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";

import { POST_DETAIL_TAB, type PostDetailTab } from "../model/post-detail-tab";

interface PostDetailTabsProps {
  tab: PostDetailTab;
  unresolvedReportCount: number;
  memberLabel: string;
  reportPanel: ReactNode | null;
  contentPanel: ReactNode;
  memberPanel: ReactNode;
}

// 탭은 주소의 tab으로 기억한다. 신고가 없는 구인에는 신고 탭을 두지 않는다.
export function PostDetailTabs({
  tab,
  unresolvedReportCount,
  memberLabel,
  reportPanel,
  contentPanel,
  memberPanel,
}: PostDetailTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const reportCountForeground = unresolvedReportCount > 0 ? "danger" : "hint";
  return (
    <Tabs.Root
      value={tab}
      onValueChange={(value) => {
        const next = new URLSearchParams(searchParams);
        next.set("tab", value);
        router.replace(`${pathname}?${next}`, { scroll: false });
      }}
    >
      <HStack align="center" className="border-b border-(--rc-color-border-subtle) px-150">
        <Tabs.List aria-label="구인 상세 보기" scrollable={false} className="border-b-0">
          {reportPanel ? (
            <Tabs.Trigger value={POST_DETAIL_TAB.reports} className="gap-075">
              신고
              <Text typography="body4" weight="bold" foreground={reportCountForeground} numeric>
                {unresolvedReportCount}
              </Text>
            </Tabs.Trigger>
          ) : null}
          <Tabs.Trigger value={POST_DETAIL_TAB.content}>구인 내용</Tabs.Trigger>
          <Tabs.Trigger value={POST_DETAIL_TAB.members} className="gap-075">
            참여자
            <Text typography="body4" weight="bold" foreground="hint" numeric>
              {memberLabel}
            </Text>
          </Tabs.Trigger>
          <Tabs.Indicator />
        </Tabs.List>
        {tab === POST_DETAIL_TAB.content ? (
          <Text typography="body4" foreground="hint" className="ml-auto">
            스포일러 가림 없이 보여줍니다
          </Text>
        ) : null}
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
    </Tabs.Root>
  );
}
