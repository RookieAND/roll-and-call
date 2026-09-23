import { Card, HStack, Skeleton, VStack } from "@roll-and-call/ui";

// GameCard와 같은 치수: 16:9 썸네일 · 제목 heading2 + D-n·상태 배지 · 룰 줄 · 일정 줄 · 구분선 아래 GM 아바타 24px + 정원 칸.
export function GameListSkeleton() {
  return (
    <VStack className="gap-125">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card.Root
          key={index}
          radius={600}
          background="none"
          padding="none"
          className="overflow-hidden"
        >
          <Skeleton width="100%" rounded="none" className="aspect-video" />
          <VStack gap="125" className="px-175 pt-175">
            <VStack gap="075">
              <HStack align="center" gap="100">
                <Skeleton width="50%" height={26} />
                <span className="flex-1" />
                <Skeleton width={36} height={24} rounded={300} />
                <Skeleton width={56} height={24} rounded={300} />
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
            className="mx-175 mt-150 border-t border-gray-200 pt-125 pb-150"
          >
            <Skeleton width={96} height={24} />
            <Skeleton width={112} height={26} />
          </HStack>
        </Card.Root>
      ))}
    </VStack>
  );
}
