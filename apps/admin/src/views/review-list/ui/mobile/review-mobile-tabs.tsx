"use client";

import { Skeleton, Tabs } from "@roll-and-call/ui";
import { isUndefined } from "es-toolkit";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { REVIEW_LIST_PATH } from "@/entities/review";
import { TabCount, useServerPath } from "@/shared/ui";

interface ReviewMobileTabsProps {
  // 불러오는 중이면 없고 건수 자리만 뼈대로 그린다.
  counts?: { all: number; hidden: number };
}

// 탭을 바꿔도 검색·사진·구인 칩·정렬은 그대로 둔다.
export function ReviewMobileTabs({ counts }: ReviewMobileTabsProps) {
  const router = useRouter();
  const toServerPath = useServerPath();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.size ? `?${searchParams}` : "";
  const value = pathname.endsWith(REVIEW_LIST_PATH.hidden)
    ? REVIEW_LIST_PATH.hidden
    : REVIEW_LIST_PATH.all;
  const tabs = [
    { label: "전체 후기", path: REVIEW_LIST_PATH.all, count: counts?.all },
    { label: "숨긴 후기", path: REVIEW_LIST_PATH.hidden, count: counts?.hidden },
  ];
  return (
    <Tabs.Root value={value} onValueChange={(path) => router.push(toServerPath(`${path}${query}`))}>
      <Tabs.List aria-label="후기 화면" className="bg-surface px-200 [&>button]:flex-1">
        {tabs.map((tab) => (
          <Tabs.Trigger key={tab.path} value={tab.path}>
            {tab.label}
            {isUndefined(tab.count) ? (
              <Skeleton width={16} height={12} render={<span />} className="inline-block" />
            ) : (
              <TabCount count={tab.count} selected={tab.path === value} />
            )}
          </Tabs.Trigger>
        ))}
        <Tabs.Indicator />
      </Tabs.List>
    </Tabs.Root>
  );
}
