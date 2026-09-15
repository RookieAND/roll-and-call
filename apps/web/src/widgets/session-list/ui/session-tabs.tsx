import { cn } from "@trpg/ui";
import Link from "next/link";

// ponytail: 밑줄 탭은 Chip·SegmentControl과 룩이 달라 링크로 손코딩.
export function SessionTabs({
  label,
  tabs,
  activeKey,
}: {
  label: string;
  tabs: ReadonlyArray<{ key: string; label: string; count: number; href: string }>;
  activeKey: string;
}) {
  return (
    <nav aria-label={label} className="flex px-4">
      {tabs.map((tab) => {
        const selected = tab.key === activeKey;
        return (
          <Link
            key={tab.key}
            href={tab.href}
            aria-current={selected ? "page" : undefined}
            className={cn(
              "flex h-11 flex-1 items-center justify-center border-b-2 text-sm font-bold tabular-nums",
              selected ? "border-primary-600 text-primary-ink" : "border-transparent text-hint",
            )}
          >
            {tab.label} {tab.count}
          </Link>
        );
      })}
    </nav>
  );
}
