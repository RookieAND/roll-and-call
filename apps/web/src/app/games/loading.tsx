import { Container, Skeleton, VStack } from "@trpg/ui";
import { GameSearchForm } from "@/features/filter-games";
import { GameListSkeleton, GamesAppBar } from "@/views/games";

// 시안 2b: 머리말과 검색바는 바로 뜨고 카드만 셰이머로 채운다.
// 셸을 손으로 다시 그리지 않고 실제 화면과 같은 조각을 쓴다.
export default function Loading() {
  return (
    <>
      <GamesAppBar />
      <Container>
        <div className="flex flex-col gap-3 px-4 pt-4 pb-2">
          <GameSearchForm />
          <Skeleton className="h-4 w-16" />
        </div>
        <VStack gap={4} className="pt-3 pb-4">
          <GameListSkeleton />
        </VStack>
      </Container>
    </>
  );
}
