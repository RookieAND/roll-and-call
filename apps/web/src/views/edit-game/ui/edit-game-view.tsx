import { Button, Container, VStack } from "@roll-and-call/ui";
import Link from "next/link";
import { notFound } from "next/navigation";

import { LoginRequired } from "@/features/auth";
import { getGameById, getCurrentUser } from "@/shared/server";
import { AppBar, EmptyState } from "@/shared/ui";
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
          {user ? (
            <EmptyState
              title="GM만 볼 수 있는 화면입니다"
              description="이 구인글의 수정은 GM만 할 수 있습니다."
              action={
                <Button
                  render={<Link href={`/games/${id}`} />}
                  variant="outline"
                  className="h-11 w-full"
                >
                  구인 상세로 돌아가기
                </Button>
              }
            />
          ) : (
            <LoginRequired />
          )}
        </VStack>
      </Container>
    </>
  );
}
