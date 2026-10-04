"use client";

import { HStack, Skeleton, Text } from "@roll-and-call/ui";
import { isUndefined } from "es-toolkit";
import { usePathname, useSearchParams } from "next/navigation";

import { REVIEW_LIST_PATH } from "@/shared/lib";
import { RouteTabs } from "@/shared/ui";

interface ReviewTabsProps {
  // 불러오는 중이면 없고 건수 자리만 뼈대로 그린다.
  counts?: { all: number; hidden: number };
}

// 탭을 바꿔도 검색·사진·구인 칩·정렬은 그대로 둔다. 숫자는 회색 글자이고 0도 보인다(D190).
export function ReviewTabs({ counts }: ReviewTabsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.size ? `?${searchParams}` : "";
  const hiddenActive = pathname.endsWith(REVIEW_LIST_PATH.hidden);
  const tabs = [
    { label: "전체 후기", href: `${REVIEW_LIST_PATH.all}${query}`, count: counts?.all },
    { label: "숨긴 후기", href: `${REVIEW_LIST_PATH.hidden}${query}`, count: counts?.hidden },
  ];
  const items = tabs.map((tab) => ({
    href: tab.href,
    label: (
      <HStack align="center" gap="075" render={<span />}>
        {tab.label}
        {isUndefined(tab.count) ? (
          <Skeleton width={16} height={12} render={<span />} className="inline-block" />
        ) : (
          <Text typography="body3" foreground="hint" numeric render={<span />}>
            {tab.count}
          </Text>
        )}
      </HStack>
    ),
  }));
  const value = hiddenActive ? tabs[1]!.href : tabs[0]!.href;
  return <RouteTabs label="후기 화면" items={items} value={value} />;
}
