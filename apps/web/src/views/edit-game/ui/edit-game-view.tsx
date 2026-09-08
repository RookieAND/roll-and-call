import { notFound, redirect } from "next/navigation";
import { Container, VStack } from "@trpg/ui";
import { getGameById, getCurrentUser } from "@/shared/server";
import { EditGameForm } from "@/widgets/game-form";
import { AppBar } from "@/shared/ui";
export async function EditGameView({ id }: { id: string }) {
  const game = await getGameById(id);
  if (!game) notFound();

  const user = await getCurrentUser();
  if (user?.id !== game.gmId) redirect(`/games/${id}`);

  return (
    <>
      <AppBar back={`/games/${id}`} title="구인 수정" />
      <Container size="md">
        <VStack gap={6} className="py-6">
          <EditGameForm game={game} />
        </VStack>
      </Container>
    </>
  );
}
