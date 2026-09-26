"use client";

import { Tabs } from "@roll-and-call/ui";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

interface RouteTabsProps {
  label: string;
  items: { label: ReactNode; href: string }[];
  value: string;
}

// 머리말 아래의 탭. 탭마다 다른 주소로 옮겨 간다.
export function RouteTabs({ label, items, value }: RouteTabsProps) {
  const router = useRouter();
  return (
    <Tabs.Root data-full-bleed value={value} onValueChange={(href) => router.push(href)}>
      <Tabs.List
        aria-label={label}
        scrollable={false}
        className="border-b border-gray-200 bg-surface px-page"
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
