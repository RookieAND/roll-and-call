import { cn } from "@trpg/ui";
import Link from "next/link";

interface SessionTabsProps {
  label: string;
  tabs: ReadonlyArray<{ key: string; label: string; count: number; href: string }>;
  activeKey: string;
}

// ponytail: 밑줄 탭은 Chip·SegmentControl과 룩이 달라 링크로 손코딩.
export function SessionTabs({ label, tabs, activeKey }: SessionTabsProps) {
  return (
    <nav aria-label={label} className="flex px-200">
      {tabs.map((tab) => {
        const selected = tab.key === activeKey;
        return (
          <Link
            key={tab.key}
            href={tab.href}
            aria-current={selected ? "page" : undefined}
            className={cn(
              "flex h-[46px] flex-1 items-center justify-center border-b-2 text-sm tabular-nums",
              selected
                ? "border-primary-600 font-bold text-primary-ink"
                : "border-transparent font-semibold text-gray-600",
            )}
          >
            {tab.label} {tab.count}
          </Link>
        );
      })}
    </nav>
  );
}
