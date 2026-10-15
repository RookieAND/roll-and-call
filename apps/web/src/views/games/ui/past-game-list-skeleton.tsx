import { Card, HStack, Skeleton, VStack, cn } from "@roll-and-call/ui";
import { range } from "es-toolkit";

import { LIVE_GRID_CLASS } from "../lib/games-desktop-class";

export function PastGameListSkeleton() {
  return (
    <>
      <VStack className="gap-125 desktop:hidden">
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
      <div className={cn("hidden", LIVE_GRID_CLASS)}>
        <Skeleton width={72} height={20} className="desktop:col-span-full" />
        {range(3).map((index) => (
          <Card.Root
            key={index}
            radius={600}
            background="none"
            padding="none"
            className="overflow-hidden"
          >
            <Skeleton width="100%" rounded="none" className="aspect-video" />
            <VStack gap="100" className="px-175 pt-175 pb-200">
              <Skeleton width={56} height={24} rounded={300} />
              <Skeleton width="60%" height={24} />
              <Skeleton width="45%" height={20} />
            </VStack>
          </Card.Root>
        ))}
      </div>
    </>
  );
}
