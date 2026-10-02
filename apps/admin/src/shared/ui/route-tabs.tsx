"use client";

import { Tabs } from "@roll-and-call/ui";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

import { useServerPath } from "./use-server-path";

interface RouteTabsProps {
  label: string;
  items: { label: ReactNode; href: string }[];
  value: string;
}

export function RouteTabs({ label, items, value }: RouteTabsProps) {
  const router = useRouter();
  const toServerPath = useServerPath();
  return (
    <Tabs.Root
      data-full-bleed
      value={value}
      onValueChange={(href) => router.push(toServerPath(href))}
    >
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
