import { notFound } from "next/navigation";
import Link from "next/link";
import { Button, Container, VStack } from "@trpg/ui";
import { LoginRequired } from "@/features/auth";
import { getGameById, getCurrentUser } from "@/shared/server";
import { EditGameForm } from "@/widgets/game-form";
import { AppBar, EmptyState } from "@/shared/ui";
export async function EditGameView({ id }: { id: string }) {
  const game = await getGameById(id);
  if (!game) notFound();

  const user = await getCurrentUser();
  // GM이면 수정 폼이 앱바·하단 바까지 화면 셸을 소유한다.
  if (user?.id === game.gmId) return <EditGameForm game={game} />;

  return (
    <>
      <AppBar back={`/games/${id}`} title="구인 수정" />
      <Container size="md">
        <VStack gap={6} className="py-6">
          {/* 조용히 튕기지 않는다: 비로그인은 로그인 안내, GM이 아니면 권한 안내. */}
          {user ? (
            <EmptyState
              title="GM만 볼 수 있는 화면입니다"
              description="이 구인글의 수정은 GM만 할 수 있습니다."
              action={
                <Button asChild variant="outline" className="h-11 w-full">
                  <Link href={`/games/${id}`}>구인 상세로 돌아가기</Link>
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
