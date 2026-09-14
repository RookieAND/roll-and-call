"use client";

import { cn } from "@trpg/ui";
import { useState, type ReactNode } from "react";

// ponytail: iOS식 세그먼트 탭(트랙+shadow)에 탭 패널이 붙어 SegmentControl(라디오 설정)과 역할이 달라 유지.
export function ScheduleTabs({
  mine,
  overlap,
  respondentCount,
}: {
  mine: ReactNode;
  overlap: ReactNode;
  // 전체 겹침 탭 라벨에 붙이는 응답자 수
  respondentCount: number;
}) {
  const [tab, setTab] = useState<"mine" | "overlap">("mine");
  const tabs = [
    { key: "mine", label: "내 가능 시간" },
    { key: "overlap", label: `전체 겹침 ${respondentCount}` },
  ] as const;

  return (
    <div className="flex flex-col gap-3">
      <div role="tablist" className="flex gap-1 rounded-[11px] bg-gray-100 p-1">
        {tabs.map((t) => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(t.key)}
              className={cn(
                "h-9 flex-1 rounded-lg text-sm font-bold tabular-nums transition-colors",
                active ? "bg-surface text-gray-900 shadow-sm" : "text-gray-600",
              )}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      <div className={tab === "mine" ? "" : "hidden"}>{mine}</div>
      <div className={tab === "overlap" ? "" : "hidden"}>{overlap}</div>
    </div>
  );
}
