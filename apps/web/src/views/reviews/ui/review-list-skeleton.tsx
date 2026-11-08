import { Card, HStack, Skeleton, VStack } from "@roll-and-call/ui";
import { range } from "es-toolkit";

interface ReviewListSkeletonProps {
  count?: number;
}

export function ReviewListSkeleton({ count = 2 }: ReviewListSkeletonProps) {
  return (
    <VStack gap="150" aria-busy>
      {range(count).map((index) => (
        <Card.Root key={index} padding="md" radius={500}>
          <VStack gap="125">
            <HStack align="center" gap="125">
              <Skeleton width={32} height={32} rounded="full" />
              <VStack gap="025" className="min-w-0 flex-1">
                <Skeleton width={100 + index * 20} height={19} />
                <Skeleton width={140} height={15} />
              </VStack>
            </HStack>
            <div aria-hidden className="h-px bg-gray-200" />
            <VStack gap="050">
              <Skeleton width="100%" height={16} />
              <Skeleton width="70%" height={16} />
            </VStack>
          </VStack>
        </Card.Root>
      ))}
    </VStack>
  );
}
