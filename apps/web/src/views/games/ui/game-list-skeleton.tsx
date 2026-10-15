import { Card, HStack, Skeleton, VStack, cn } from "@roll-and-call/ui";
import { range } from "es-toolkit";

import { LIVE_GRID_CLASS } from "../lib/games-desktop-class";

export function GameListSkeleton() {
  return (
    <VStack className={cn("gap-125", LIVE_GRID_CLASS)}>
      {range(3).map((index) => (
        <Card.Root
          key={index}
          radius={600}
          background="none"
          padding="none"
          className="overflow-hidden desktop:flex desktop:flex-col"
        >
          <Skeleton width="100%" rounded="none" className="aspect-video" />
          <VStack gap="125" className="px-175 pt-175 desktop:flex-1">
            <VStack gap="075" className="desktop:flex-1">
              <HStack align="center" gap="100" className="desktop:flex-wrap desktop:gap-075">
                <Skeleton width="50%" height={26} className="desktop:order-2" />
                <span className="flex-1 desktop:hidden" />
                <Skeleton width={36} height={24} rounded={300} className="desktop:order-1" />
                <Skeleton width={56} height={24} rounded={300} className="desktop:order-0" />
              </HStack>
              <Skeleton width="33.333%" height={20} />
            </VStack>
            <HStack align="center" gap="075">
              <Skeleton width={14} height={14} rounded={100} />
              <Skeleton height={20} className="flex-1" />
            </HStack>
          </VStack>
          <HStack
            align="center"
            justify="between"
            gap="100"
            className="mx-175 mt-150 border-t border-gray-200 pt-125 pb-150 desktop:border-t-0 desktop:pt-0 desktop:pb-175"
          >
            <Skeleton width={96} height={24} />
            <Skeleton width={112} height={26} />
          </HStack>
        </Card.Root>
      ))}
    </VStack>
  );
}
