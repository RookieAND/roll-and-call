import { Skeleton, VStack } from "@trpg/ui";

// GameCard와 같은 치수: 16:9 썸네일 · 제목 heading3 22px + 배지 21px · 룰 body2 21px · 일정 줄 21px · GM 아바타 24px.
export function GameListSkeleton() {
  return (
    <VStack className="gap-2.5">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-[14px] border border-gray-200">
          <Skeleton className="aspect-video w-full rounded-none" />
          <VStack gap={2} className="p-4">
            <div className="flex items-start justify-between gap-2">
              <Skeleton className="h-[22px] w-1/2" />
              <Skeleton className="h-[21px] w-14 rounded-[7px]" />
            </div>
            <Skeleton className="h-[21px] w-1/3" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-[21px] w-2/3" />
              <Skeleton className="h-[21px] w-8" />
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-5 w-20" />
            </div>
          </VStack>
        </div>
      ))}
    </VStack>
  );
}
