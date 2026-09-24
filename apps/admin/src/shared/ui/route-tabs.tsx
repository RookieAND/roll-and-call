"use client";

import { Tabs } from "@roll-and-call/ui";
import { useRouter } from "next/navigation";

interface RouteTabsProps {
  label: string;
  items: { label: string; href: string }[];
  value: string;
}

// 머리말 아래의 탭. 탭마다 다른 주소로 옮겨 간다.
export function RouteTabs({ label, items, value }: RouteTabsProps) {
  const router = useRouter();
  return (
    <Tabs.Root value={value} onValueChange={(href) => router.push(href)}>
      <Tabs.List
        aria-label={label}
        scrollable={false}
        className="border-b border-gray-200 bg-surface px-225"
      >
        {items.map((item) => (
          <Tabs.Trigger key={item.href} value={item.href}>
            {item.label}
          </Tabs.Trigger>
        ))}
        <Tabs.Indicator />
      </Tabs.List>
    </Tabs.Root>
  );
}
