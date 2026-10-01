import { HStack, Skeleton, Tabs } from "@roll-and-call/ui";
import type { ReactNode } from "react";

interface SkeletonTabsProps {
  items: (string | null)[];
  right?: ReactNode;
}

const FIRST_TAB = "0";

export function SkeletonTabs({ items, right }: SkeletonTabsProps) {
  return (
    <Tabs.Root value={FIRST_TAB}>
      <HStack
        align="center"
        className="border-b border-(--rc-color-border-subtle) bg-surface px-150"
      >
        <Tabs.List aria-hidden inert scrollable={false} className="border-b-0">
          {items.map((item, index) => (
            <Tabs.Trigger key={index} value={String(index)}>
              {item ?? <Skeleton width={56} height={14} />}
            </Tabs.Trigger>
          ))}
          <Tabs.Indicator />
        </Tabs.List>
        {right ? (
          <HStack align="center" gap="075" className="ml-auto">
            {right}
          </HStack>
        ) : null}
      </HStack>
    </Tabs.Root>
  );
}
