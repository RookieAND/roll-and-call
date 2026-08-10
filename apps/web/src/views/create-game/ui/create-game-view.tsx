import { redirect } from "next/navigation";
import { Container, VStack } from "@trpg/ui";
import { CreateGameForm } from "@/features/create-game";
import { createClient } from "@/shared/api/supabase/server";

export async function CreateGameView() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  return (
    <Container size="md">
      <VStack gap={6} className="py-8">
        <h1 className="text-2xl font-bold">새 구인 등록</h1>
        <CreateGameForm />
      </VStack>
    </Container>
  );
}
