import { HStack, Skeleton, Tabs } from "@roll-and-call/ui";
import type { ReactNode } from "react";

interface SkeletonTabsProps {
  // null이면 탭 이름도 데이터에 따라 달라져서 뼈대로 둔다.
  items: (string | null)[];
  right?: ReactNode;
}

const FIRST_TAB = "0";

// 불러오는 동안의 탭 줄. 첫 탭을 고른 모양으로 그리고 누를 수는 없다.
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
