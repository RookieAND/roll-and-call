import { Container, VStack } from "@roll-and-call/ui";

import { GameListSkeleton, GamesAppBar, GamesToolbar } from "@/views/games";

export default function Loading() {
  return (
    <>
      <GamesAppBar />
      <Container>
        <GamesToolbar />
        <VStack gap="150" className="pt-150 pb-200">
          <GameListSkeleton />
        </VStack>
      </Container>
    </>
  );
}
