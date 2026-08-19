import Link from "next/link";
import { redirect } from "next/navigation";
import { Avatar, Button, Container, HStack, Text, VStack } from "@trpg/ui";
import {
  countGamesByStatus,
  GAME_LIST_CONTEXT,
  GAME_STATUS,
} from "@/entities/game";
import { getGamesByGm, getJoinedGames } from "@/entities/game/api/queries";
import { getProfile } from "@/entities/profile/api/queries";
import { getCurrentUser } from "@/shared/api/supabase/server";
import { AppBar } from "@/shared/ui/app-bar";
import { EmptyState } from "@/shared/ui/empty-state";
import { ThemeToggle } from "@/shared/ui/theme-toggle";
import { GameListItem } from "@/widgets/game-list-item";

export async function MyPageView() {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  const [profile, mine, joined] = await Promise.all([
    getProfile(user.id),
    getGamesByGm(user.id),
    getJoinedGames(user.id),
  ]);

  const name =
    profile?.username ??
    user.user_metadata.full_name ??
    user.user_metadata.name ??
    user.email ??
    "";
  const avatar =
    profile?.avatarUrl ??
    (user.user_metadata.avatar_url as string | undefined) ??
    null;
  const handle =
    (user.user_metadata.user_name as string | undefined) ??
    (user.user_metadata.preferred_username as string | undefined) ??
    null;

  // 확정/모집중을 구분하지 않고, 참여 중인 세션과 모집 중인 세션 개수만 노출.
  const recruitingCount = countGamesByStatus({
    games: mine,
    status: GAME_STATUS.recruiting,
  });
  const summary = [
    { n: joined.length, label: "참여 중인 세션" },
    { n: recruitingCount, label: "모집 중인 세션" },
  ];

  return (
    <>
      <AppBar title="마이페이지" />
      <Container>
        <VStack gap={6} className="py-6">
          <HStack justify="between" align="center">
            <HStack gap={3} align="center">
              <Avatar src={avatar} name={name} size="2xl" />
              <div>
                <Text size="lg" weight="bold" className="block">
                  {name}
                </Text>
                {handle && (
                  <span className="font-mono text-xs text-[#9A9AA5]">
                    @{handle}
                  </span>
                )}
              </div>
            </HStack>
            <HStack gap={2} align="center">
              <ThemeToggle />
              <Button asChild size="sm" variant="outline">
                <Link href="/me/edit">편집</Link>
              </Button>
            </HStack>
          </HStack>

          <HStack gap={2}>
            {summary.map((m) => (
              <div
                key={m.label}
                className="flex-1 rounded-[13px] border border-gray-200 p-3"
              >
                <div
                  className={`text-[21px] font-extrabold tabular-nums ${
                    m.n === 0 ? "text-[#C6C6CE]" : ""
                  }`}
                >
                  {m.n}
                </div>
                <Text size="xs" color="muted" className="mt-0.5 block text-[11.5px]">
                  {m.label}
                </Text>
              </div>
            ))}
          </HStack>

          <VStack gap={2}>
            <HStack justify="between" align="center">
              <Text as="h2" weight="bold" size="sm">
                내가 만든 구인
              </Text>
              <Text size="xs" color="muted">
                {mine.length}건
              </Text>
            </HStack>
            {mine.length === 0 ? (
              <EmptyState
                title="아직 만든 구인이 없습니다"
                description="GM으로 첫 세션을 열어보세요."
                action={
                  <Button asChild variant="outline">
                    <Link href="/games/new">새 구인 등록</Link>
                  </Button>
                }
              />
            ) : (
              <VStack gap={2}>
                {mine.map((game) => (
                  <GameListItem
                    key={game.id}
                    game={game}
                    context={GAME_LIST_CONTEXT.mine}
                  />
                ))}
              </VStack>
            )}
          </VStack>

          <VStack gap={2}>
            <HStack justify="between" align="center">
              <Text as="h2" weight="bold" size="sm">
                참여 중인 게임
              </Text>
              <Text size="xs" color="muted">
                {joined.length}건
              </Text>
            </HStack>
            {joined.length === 0 ? (
              <EmptyState
                title="아직 참여 중인 게임이 없습니다"
                description="모집 중인 구인을 둘러보세요."
                action={
                  <Button asChild variant="outline">
                    <Link href="/games">구인 목록 보기</Link>
                  </Button>
                }
              />
            ) : (
              <VStack gap={2}>
                {joined.map((game) => (
                  <GameListItem
                    key={game.id}
                    game={game}
                    context={GAME_LIST_CONTEXT.joined}
                  />
                ))}
              </VStack>
            )}
          </VStack>
        </VStack>
      </Container>
    </>
  );
}
