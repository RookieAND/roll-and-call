import { Card, Skeleton, VStack } from "@roll-and-call/ui";
import { range } from "es-toolkit";

import { SESSION_GRID_CLASS } from "./session-grid-class";

export function SessionListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <VStack gap="125" className={SESSION_GRID_CLASS}>
      {range(count).map((index) => (
        <Card.Root key={index} padding="none" radius={600} className="overflow-hidden">
          <Skeleton width="100%" rounded="none" className="aspect-video" />
          <VStack gap="150" className="p-175">
            <VStack gap="075" className="flex-1">
              <Skeleton width={64} height={24} rounded={300} />
              <Skeleton width="80%" height={22} />
              <Skeleton width="60%" height={17} />
            </VStack>
            <Skeleton width="70%" height={20} />
          </VStack>
        </Card.Root>
      ))}
    </VStack>
  );
}
