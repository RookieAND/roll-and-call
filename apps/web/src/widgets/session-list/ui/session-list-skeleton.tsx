import { Card, HStack, Skeleton, VStack } from "@roll-and-call/ui";
import { range } from "es-toolkit";

import { SESSION_GRID_CLASS } from "./session-grid-class";

export function SessionListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <VStack gap="125" className={SESSION_GRID_CLASS}>
      {range(count).map((index) => (
        <Card.Root key={index} padding="md" radius={600}>
          <VStack gap="150">
            <HStack gap="125" align="start">
              <Skeleton width={56} height={56} rounded={300} />
              <VStack gap="075" className="flex-1">
                <Skeleton width={64} height={24} rounded={300} />
                <Skeleton width="80%" height={22} />
                <Skeleton width="60%" height={17} />
              </VStack>
            </HStack>
            <Skeleton width="70%" height={20} />
          </VStack>
        </Card.Root>
      ))}
    </VStack>
  );
}
