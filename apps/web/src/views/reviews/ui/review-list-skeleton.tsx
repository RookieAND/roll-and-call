import { Card, Skeleton, VStack } from "@roll-and-call/ui";
import { range } from "es-toolkit";

interface ReviewListSkeletonProps {
  count?: number;
}

export function ReviewListSkeleton({ count = 2 }: ReviewListSkeletonProps) {
  return (
    <VStack gap="150" aria-busy>
      {range(count).map((index) => (
        <Card.Root key={index} radius={500}>
          <VStack gap="100">
            <Skeleton width={100 + index * 20} height={18} />
            <Skeleton width={140} height={14} />
            <Skeleton width="100%" height={40} />
          </VStack>
        </Card.Root>
      ))}
    </VStack>
  );
}
