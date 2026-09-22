import { Card, HStack, Skeleton, VStack } from "@roll-and-call/ui";

// GameCard와 같은 치수: 16:9 썸네일 · 제목 heading3 22px + 배지 21px + D-n 21px · 룰 21px · 일정 줄 21px(아이콘 13px) · GM 아바타 24px + 정원 칸 줄.
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
          <VStack className="gap-075 px-175 py-175">
            <HStack align="center" gap="100">
              <Skeleton width="50%" height={22} />
              <span className="flex-1" />
              <Skeleton width={56} height={21} rounded={300} />
              <Skeleton width={28} height={21} />
            </HStack>
            <Skeleton width="33.333%" height={21} />
            <HStack align="center" gap="075">
              <Skeleton width={13} height={13} rounded={100} />
              <Skeleton height={21} className="flex-1" />
            </HStack>
            <HStack align="center" justify="between" gap="100" className="mt-050">
              <Skeleton width={96} height={24} />
              <Skeleton width={112} height={21} />
            </HStack>
          </VStack>
        </Card.Root>
      ))}
    </VStack>
  );
}
