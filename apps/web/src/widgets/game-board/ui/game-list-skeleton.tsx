import { Skeleton, VStack } from "@trpg/ui";

// GameList Suspense 폴백. app/games/loading.tsx의 카드 셰이머와 동일한 모양이라
// 라우트 폴백 → 스트리밍 전환이 매끄럽게 이어진다.
export function GameListSkeleton() {
  return (
    <VStack className="gap-2.5">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-[14px] border border-gray-200 p-4">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="mt-2 h-3 w-1/3" />
          <div className="mt-4 flex justify-between">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-16" />
          </div>
        </div>
      ))}
    </VStack>
  );
}
