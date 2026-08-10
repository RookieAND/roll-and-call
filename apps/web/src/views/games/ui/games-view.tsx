import Link from "next/link";
import { Container, Grid, HStack, VStack } from "@trpg/ui";
import { GameCard } from "@/entities/game";
import { getGames } from "@/entities/game/api/queries";

export async function GamesView() {
  const games = await getGames();

  return (
    <Container>
      <VStack gap={6} className="py-8">
        <HStack justify="between" align="center">
          <h1 className="text-2xl font-bold">구인 목록</h1>
          <Link
            href="/games/new"
            className="rounded-md bg-black px-4 py-2 font-medium text-white"
          >
            새 구인
          </Link>
        </HStack>
        {games.length === 0 ? (
          <p className="text-gray-500">아직 등록된 구인이 없어요.</p>
        ) : (
          <Grid
            cols={1}
            gap={4}
            className="sm:grid-cols-2 lg:grid-cols-3"
          >
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </Grid>
        )}
      </VStack>
    </Container>
  );
}
