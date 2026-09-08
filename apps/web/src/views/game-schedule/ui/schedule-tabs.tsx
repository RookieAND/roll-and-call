"use client";

import { cn } from "@trpg/ui";
import { useState, type ReactNode } from "react";
// ponytail: iOS식 세그먼트 컨트롤(트랙+shadow)이라 테두리 pill인 Chip과 룩이 달라 유지.
const TABS = [
  { key: "mine", label: "내 가능 시간" },
  { key: "overlap", label: "전체 겹침" },
] as const;

export function ScheduleTabs({ mine, overlap }: { mine: ReactNode; overlap: ReactNode }) {
  const [tab, setTab] = useState<"mine" | "overlap">("mine");

  return (
    <div className="flex flex-col gap-3">
      <div role="tablist" className="flex gap-1 rounded-[11px] bg-[#F3F3F7] p-1">
        {TABS.map((t) => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(t.key)}
              className={cn(
                "h-9 flex-1 rounded-lg text-sm font-bold transition-colors",
                active ? "bg-surface text-gray-900 shadow-sm" : "text-gray-500",
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
