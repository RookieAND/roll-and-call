import { redirect } from "next/navigation";
import { Container, VStack } from "@trpg/ui";
import { CreateGameForm } from "@/widgets/game-form";
import { getCurrentUser } from "@/shared/api/supabase/server";
import { AppBar } from "@/shared/ui/app-bar";

export async function CreateGameView() {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  return (
    <>
      <AppBar back="/games" title="새 구인 등록" />
      <Container size="md">
        <VStack gap={6} className="py-6">
          <CreateGameForm />
        </VStack>
      </Container>
    </>
  );
}
