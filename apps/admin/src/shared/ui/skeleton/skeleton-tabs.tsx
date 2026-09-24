import { HStack, Skeleton, Text, cn } from "@roll-and-call/ui";
import type { ReactNode } from "react";

interface SkeletonTabsProps {
  // null이면 탭 이름도 데이터에 따라 달라져서 뼈대로 둔다.
  items: (string | null)[];
  right?: ReactNode;
}

// 불러오는 동안의 탭 줄. 첫 탭을 고른 모양으로 그리고 누를 수는 없다.
export function SkeletonTabs({ items, right }: SkeletonTabsProps) {
  return (
    <HStack
      align="center"
      gap="025"
      aria-hidden
      className="border-b border-(--rc-color-border-subtle) bg-surface px-150"
    >
      {items.map((item, index) => (
        <HStack
          key={index}
          align="center"
          className={cn(
            "min-h-5 p-150 whitespace-nowrap",
            index === 0 && "shadow-[inset_0_-2px_0_var(--rc-color-bg-primary)]",
          )}
        >
          {item === null ? (
            <Skeleton width={56} height={14} />
          ) : (
            <Text
              typography="body3"
              weight={index === 0 ? "bold" : "medium"}
              foreground={index === 0 ? "inherit" : "muted"}
              className={index === 0 ? "text-(--rc-color-fg-primary-strong)" : undefined}
            >
              {item}
            </Text>
          )}
        </HStack>
      ))}
      {right ? (
        <HStack align="center" gap="075" className="ml-auto">
          {right}
        </HStack>
      ) : null}
    </HStack>
  );
}
