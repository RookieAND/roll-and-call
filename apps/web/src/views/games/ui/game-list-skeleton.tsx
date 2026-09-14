import { Skeleton, VStack } from "@trpg/ui";

// GameList Suspense 폴백이자 app/games/loading.tsx의 카드 셰이머.
// GameCard(썸네일 없는 경우)와 줄 높이를 맞춘다: 제목 heading3 22px · 룰 body2 21px · GM 아바타 24px.
export function GameListSkeleton() {
  return (
    <VStack className="gap-2.5">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-[14px] border border-gray-200">
          <VStack gap={2} className="p-4">
            <div className="flex items-start justify-between gap-2">
              <Skeleton className="h-[22px] w-1/2" />
              <Skeleton className="h-[21px] w-14 rounded-[7px]" />
            </div>
            <Skeleton className="h-[21px] w-1/3" />
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
