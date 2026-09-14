import { Container, VStack } from "@trpg/ui";
import { GameListSkeleton, GamesAppBar, GamesToolbar } from "@/views/games";

// 시안 2b: 머리말과 검색바는 바로 뜨고 카드만 셰이머로 채운다.
// 셸을 손으로 다시 그리지 않고 실제 화면(GameBoard)과 같은 조각을 쓴다.
export default function Loading() {
  return (
    <>
      <GamesAppBar />
      <Container>
        <GamesToolbar />
        <VStack gap={4} className="pt-3 pb-4">
          <GameListSkeleton />
        </VStack>
      </Container>
    </>
  );
}
