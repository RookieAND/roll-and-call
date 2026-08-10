import { notFound, redirect } from "next/navigation";
import { Container, VStack } from "@trpg/ui";
import { getGameById } from "@/entities/game/api/queries";
import { EditGameForm } from "@/features/edit-game";
import { createClient } from "@/shared/api/supabase/server";

export async function EditGameView({ id }: { id: string }) {
  const game = await getGameById(id);
  if (!game) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user?.id !== game.kpId) redirect(`/games/${id}`);

  return (
    <Container size="md">
      <VStack gap={6} className="py-8">
        <h1 className="text-2xl font-bold">구인 수정</h1>
        <EditGameForm game={game} />
      </VStack>
    </Container>
  );
}
