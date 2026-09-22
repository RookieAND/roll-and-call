import { Container, VStack } from "@roll-and-call/ui";

import { GameListSkeleton, GamesAppBar, GamesToolbar } from "@/views/games";

// 셸을 손으로 다시 그리지 않고 실제 화면과 같은 조각을 써서 어긋나지 않게 한다.
export default function Loading() {
  return (
    <>
      <GamesAppBar />
      <Container>
        <GamesToolbar />
        <VStack gap="200" className="pt-150 pb-200">
          <GameListSkeleton />
        </VStack>
      </Container>
    </>
  );
}
