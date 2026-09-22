"use client";

import { cn, HStack, VStack } from "@roll-and-call/ui";
import { useState, type ReactNode } from "react";

export const SCHEDULE_TAB = { mine: "mine", overlap: "overlap" } as const;
export type ScheduleTab = (typeof SCHEDULE_TAB)[keyof typeof SCHEDULE_TAB];

interface ScheduleTabsProps {
  mine: ReactNode;
  overlap: ReactNode;
  respondentCount: number;
}

// ponytail: iOS식 세그먼트 탭(트랙+shadow)에 탭 패널이 붙어 SegmentControl(라디오 설정)과 역할이 달라 유지.
export function ScheduleTabs({ mine, overlap, respondentCount }: ScheduleTabsProps) {
  const [tab, setTab] = useState<ScheduleTab>(SCHEDULE_TAB.mine);
  const tabs = [
    { key: SCHEDULE_TAB.mine, label: "내 가능 시간" },
    { key: SCHEDULE_TAB.overlap, label: `전체 겹침 ${respondentCount}` },
  ] as const;

  return (
    <VStack gap="150">
      <HStack role="tablist" gap="050" className="rounded-400 bg-gray-100 p-050">
        {tabs.map((tabItem) => {
          const active = tab === tabItem.key;
          return (
            <button
              key={tabItem.key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(tabItem.key)}
              className={cn(
                "h-9 flex-1 rounded-300 text-sm font-bold tabular-nums transition-colors",
                active ? "bg-surface text-gray-900 shadow-sm" : "text-gray-600",
              )}
            >
              {tabItem.label}
            </button>
          );
        })}
      </HStack>
      <div className={tab === SCHEDULE_TAB.mine ? "" : "hidden"}>{mine}</div>
      <div className={tab === SCHEDULE_TAB.overlap ? "" : "hidden"}>{overlap}</div>
    </VStack>
  );
}
