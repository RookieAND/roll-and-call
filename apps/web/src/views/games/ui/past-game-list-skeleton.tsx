import { Card, HStack, Skeleton, VStack } from "@roll-and-call/ui";
import { range } from "es-toolkit";

export function PastGameListSkeleton() {
  return (
    <VStack className="gap-125">
      <Skeleton width={72} height={20} />
      {range(4).map((index) => (
        <Card.Root key={index} padding="sm" background="none">
          <HStack align="center" gap="150">
            <Skeleton width={56} height={56} rounded={400} />
            <VStack gap="050" className="min-w-0 flex-1">
              <HStack align="center" gap="075">
                <Skeleton height={20} className="flex-1" />
                <Skeleton width={56} height={24} rounded={300} />
              </HStack>
              <Skeleton width="55%" height={18} />
            </VStack>
          </HStack>
        </Card.Root>
      ))}
    </VStack>
  );
}
