import { cn } from "@trpg/ui";
import Link from "next/link";

import { type MySessions, SESSION_TABS, type SessionBucket } from "@/widgets/session-list";

import { sessionsHref } from "../model/sessions-href";

// ponytail: 밑줄 탭은 Chip·SegmentControl과 룩이 달라 링크로 손코딩.
export function SessionRoleTabs({
  sessions,
  activeTab,
}: {
  sessions: MySessions;
  activeTab: SessionBucket;
}) {
  return (
    <nav aria-label="역할" className="flex px-4">
      {SESSION_TABS.map((tabItem) => {
        const selected = tabItem.key === activeTab;
        return (
          <Link
            key={tabItem.key}
            href={sessionsHref(tabItem.key)}
            aria-current={selected ? "page" : undefined}
            className={cn(
              "flex h-11 flex-1 items-center justify-center border-b-2 text-sm font-bold tabular-nums",
              selected ? "border-primary-600 text-primary-ink" : "border-transparent text-hint",
            )}
          >
            {tabItem.label} {sessions[tabItem.key].length}
          </Link>
        );
      })}
    </nav>
  );
}
