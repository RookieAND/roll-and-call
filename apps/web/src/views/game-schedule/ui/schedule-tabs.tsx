"use client";

import { cn } from "@trpg/ui";
import { useState, type ReactNode } from "react";

export const SCHEDULE_TAB = { mine: "mine", overlap: "overlap" } as const;
export type ScheduleTab = (typeof SCHEDULE_TAB)[keyof typeof SCHEDULE_TAB];

// ponytail: iOS식 세그먼트 탭(트랙+shadow)에 탭 패널이 붙어 SegmentControl(라디오 설정)과 역할이 달라 유지.
export function ScheduleTabs({
  mine,
  overlap,
  respondentCount,
}: {
  mine: ReactNode;
  overlap: ReactNode;
  respondentCount: number;
}) {
  const [tab, setTab] = useState<ScheduleTab>(SCHEDULE_TAB.mine);
  const tabs = [
    { key: SCHEDULE_TAB.mine, label: "내 가능 시간" },
    { key: SCHEDULE_TAB.overlap, label: `전체 겹침 ${respondentCount}` },
  ] as const;

  return (
    <div className="flex flex-col gap-3">
      <div role="tablist" className="flex gap-1 rounded-[11px] bg-gray-100 p-1">
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
                "h-9 flex-1 rounded-lg text-sm font-bold tabular-nums transition-colors",
                active ? "bg-surface text-gray-900 shadow-sm" : "text-gray-600",
              )}
            >
              {tabItem.label}
            </button>
          );
        })}
      </div>
      <div className={tab === SCHEDULE_TAB.mine ? "" : "hidden"}>{mine}</div>
      <div className={tab === SCHEDULE_TAB.overlap ? "" : "hidden"}>{overlap}</div>
    </div>
  );
}
