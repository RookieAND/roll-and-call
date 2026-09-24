import { HStack, Skeleton, VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

interface SkeletonItemProps {
  lines?: 1 | 2 | 3;
  right?: ReactNode;
}

// ItemCard의 뼈대.
export function SkeletonItem({ lines = 2, right }: SkeletonItemProps) {
  return (
    <HStack
      align="start"
      gap="125"
      className="rounded-400 border border-gray-200 bg-surface px-150 py-125"
    >
      <Skeleton width={26} height={26} rounded={300} />
      <VStack gap="075" className="min-w-0 flex-1 pt-025">
        <Skeleton width={180} height={14} />
        {lines > 1 ? <Skeleton width="72%" height={12} /> : null}
        {lines > 2 ? <Skeleton width="48%" height={12} /> : null}
      </VStack>
      {right}
    </HStack>
  );
}
