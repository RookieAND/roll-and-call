import { Skeleton, VStack } from "@trpg/ui";

// GameCard와 같은 치수: 16:9 썸네일 · 제목 heading3 22px + 배지 21px · 룰 21px · 일정 줄 21px(아이콘 13px) · GM 아바타 24px + 정원 칸 줄.
export function GameListSkeleton() {
  return (
    <VStack className="gap-2.5">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-[14px] border border-gray-200">
          <Skeleton className="aspect-video w-full rounded-none" />
          <VStack className="gap-1.5 px-3.5 py-[13px]">
            <div className="flex items-start justify-between gap-2">
              <Skeleton className="h-[22px] w-1/2" />
              <Skeleton className="h-[21px] w-14 rounded-[7px]" />
            </div>
            <Skeleton className="h-[21px] w-1/3" />
            <div className="flex items-center gap-1.5">
              <Skeleton className="h-[13px] w-[13px] rounded-[3px]" />
              <Skeleton className="h-[21px] flex-1" />
              <Skeleton className="h-[21px] w-9" />
            </div>
            <div className="mt-1 flex items-center justify-between gap-2">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-[21px] w-28" />
            </div>
          </VStack>
        </div>
      ))}
    </VStack>
  );
}
