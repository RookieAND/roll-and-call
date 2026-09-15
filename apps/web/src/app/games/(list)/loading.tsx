import { Container, VStack } from "@trpg/ui";

import { GameListSkeleton, GamesAppBar, GamesToolbar } from "@/views/games";

// 셸을 손으로 다시 그리지 않고 실제 화면과 같은 조각을 써서 어긋나지 않게 한다.
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
