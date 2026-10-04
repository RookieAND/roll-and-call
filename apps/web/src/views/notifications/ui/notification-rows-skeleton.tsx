import { HStack, Skeleton, VStack } from "@roll-and-call/ui";
import { range } from "es-toolkit";

interface NotificationRowsSkeletonProps {
  count: number;
}

export function NotificationRowsSkeleton({ count }: NotificationRowsSkeletonProps) {
  return range(count).map((index) => (
    <HStack key={index} align="center" gap="125" className="h-16 pr-200 pl-300">
      <Skeleton width={32} height={32} rounded="full" />
      <VStack gap="100" className="flex-1">
        <Skeleton width="85%" height={12} />
        <Skeleton width="50%" height={10} />
      </VStack>
    </HStack>
  ));
}
