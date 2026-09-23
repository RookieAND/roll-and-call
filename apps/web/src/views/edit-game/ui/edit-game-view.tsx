import { Container, VStack } from "@roll-and-call/ui";
import { notFound } from "next/navigation";

import { GmOnlyNotice } from "@/features/auth";
import { getGameById, getCurrentUser } from "@/shared/server";
import { AppBar } from "@/shared/ui";
import { EditGameForm } from "@/widgets/game-form";

export async function EditGameView({ id }: { id: string }) {
  const [game, user] = await Promise.all([getGameById(id), getCurrentUser()]);
  if (!game) notFound();
  if (user?.id === game.gmId) return <EditGameForm game={game} />;

  return (
    <>
      <AppBar back={`/games/${id}`} title="구인 수정" />
      <Container size="md">
        <VStack gap="300" className="py-300">
          <GmOnlyNotice
            gameId={id}
            signedIn={!!user}
            description="이 구인글의 수정은 GM만 할 수 있습니다."
          />
        </VStack>
      </Container>
    </>
  );
}
