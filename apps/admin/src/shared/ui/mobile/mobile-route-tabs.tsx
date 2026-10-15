"use client";

import { Tabs } from "@roll-and-call/ui";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

import { useServerPath } from "../use-server-path";

interface MobileRouteTabsProps {
  label: string;
  items: { label: ReactNode; href: string }[];
  value: string;
}

// 모바일 탭은 한 줄이고, 넘치면 가로로 스크롤한다.
export function MobileRouteTabs({ label, items, value }: MobileRouteTabsProps) {
  const router = useRouter();
  const toServerPath = useServerPath();
  return (
    <Tabs.Root value={value} onValueChange={(href) => router.push(toServerPath(href))}>
      <Tabs.List aria-label={label} className="border-b border-gray-200 bg-surface px-200">
        {items.map((item) => (
          <Tabs.Trigger key={item.href} value={item.href} className="min-h-11 whitespace-nowrap">
            {item.label}
          </Tabs.Trigger>
        ))}
        <Tabs.Indicator />
      </Tabs.List>
    </Tabs.Root>
  );
}
