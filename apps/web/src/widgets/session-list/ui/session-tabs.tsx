"use client";

import { Tabs } from "@roll-and-call/ui";
import { useRouter } from "next/navigation";

interface SessionTabsProps {
  label: string;
  tabs: ReadonlyArray<{ key: string; label: string; count: number; href: string }>;
  activeKey: string;
}

export function SessionTabs({ label, tabs, activeKey }: SessionTabsProps) {
  const router = useRouter();

  return (
    <Tabs.Root
      value={activeKey}
      onValueChange={(key) => {
        const next = tabs.find((tab) => tab.key === key);
        if (next) router.push(next.href);
      }}
    >
      <Tabs.List aria-label={label} scrollable={false} className="w-full">
        {tabs.map((tab) => (
          <Tabs.Trigger key={tab.key} value={tab.key} className="flex-1">
            {tab.label}
            <span className="tabular-nums opacity-72">{tab.count}</span>
          </Tabs.Trigger>
        ))}
        <Tabs.Indicator />
      </Tabs.List>
    </Tabs.Root>
  );
}
