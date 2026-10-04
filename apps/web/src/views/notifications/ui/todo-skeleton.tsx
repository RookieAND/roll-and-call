import { Card, Skeleton, VStack } from "@roll-and-call/ui";
import { range } from "es-toolkit";

export function TodoSkeleton() {
  return (
    <VStack gap="125">
      {range(3).map((index) => (
        <VStack key={index} gap="125" render={<Card.Root padding="none" className="p-175" />}>
          <Skeleton width="30%" height={12} />
          <Skeleton width="60%" height={16} />
          <Skeleton width="90%" height={12} />
          <Skeleton height={44} rounded={400} />
        </VStack>
      ))}
    </VStack>
  );
}
