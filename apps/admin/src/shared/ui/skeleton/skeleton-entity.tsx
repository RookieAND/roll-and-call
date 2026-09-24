import { HStack, Skeleton, VStack, cn } from "@roll-and-call/ui";
import type { ReactNode } from "react";

import { SkeletonFacts } from "./skeleton-facts";

const LEAD = {
  user: <Skeleton width={40} height={40} rounded="full" />,
  thumbnail: <Skeleton width={96} height={64} rounded={400} />,
  square: <Skeleton width={40} height={40} rounded={400} />,
} as const;

interface SkeletonEntityProps {
  lead?: keyof typeof LEAD;
  facts?: string[];
  columns?: 2 | 3 | 4 | 5;
  flat?: boolean;
  actions?: ReactNode;
}

// EntityHead의 뼈대. 이름·메타·사실 값만 비우고 사실 라벨은 그린다.
export function SkeletonEntity({
  lead = "user",
  facts,
  columns,
  flat,
  actions,
}: SkeletonEntityProps) {
  return (
    <VStack
      gap="150"
      render={<section />}
      className={cn(!flat && "rounded-600 border border-gray-200 bg-surface px-200 py-175")}
    >
      <HStack align="center" gap="150">
        {LEAD[lead]}
        <VStack gap="075" className="min-w-0 flex-1">
          <Skeleton width={flat ? 96 : 160} height={20} />
          <Skeleton width={flat ? 120 : 260} height={12} />
        </VStack>
        {actions}
      </HStack>
      {facts ? (
        <div className="border-t border-(--rc-color-border-subtle) pt-150">
          <SkeletonFacts labels={facts} columns={columns} />
        </div>
      ) : null}
    </VStack>
  );
}
