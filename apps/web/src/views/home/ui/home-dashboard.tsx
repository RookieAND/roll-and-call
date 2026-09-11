import type { User } from "@supabase/supabase-js";
import { Avatar, Button, Container, HStack, Text, VStack } from "@trpg/ui";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { profileDisplay } from "@/entities/profile";
import { SignOutButton } from "@/features/auth";
import { getGamesByGm, getJoinedGames } from "@/shared/server";
import { GameListItem } from "@/widgets/game-list-item";
import { HomeStartEmpty } from "./home-start-empty";

const TOP = 4;

// 로그인 대시보드: 인사 + 내 게임 요약. 아무것도 없으면 시작 안내로 대체한다.
export async function HomeDashboard({ user }: { user: User }) {
  const { name, avatar } = profileDisplay({ user });
  const [hosted, joined] = await Promise.all([getGamesByGm(user.id), getJoinedGames(user.id)]);

  const myGames = [
    ...hosted.map((game) => ({ game, role: "host" as const })),
    ...joined.map((game) => ({ game, role: "player" as const })),
  ].slice(0, TOP);
  const empty = myGames.length === 0;

  return (
    <Container size="sm">
      <VStack gap={6} className="py-8">
        <HStack gap={3} align="center">
          <Avatar src={avatar} name={name} size="xl" />
          <div>
            <Text typography="heading2" className="block">
              {name}님, {empty ? "처음이시네요" : "반갑습니다"}
            </Text>
            <Text typography="body2" foreground="muted">
              {empty
                ? "아직 참여 중인 게임이 없습니다"
                : `참여 중 ${joined.length} · 내가 만든 구인 ${hosted.length}`}
            </Text>
          </div>
        </HStack>

        {empty ? (
          <>
            <HomeStartEmpty />
            <HStack justify="between" align="center" className="border-t border-gray-100 pt-4">
              <Text typography="body2" foreground="muted">
                프로필과 기본 가능 시간대 설정
              </Text>
              <Link href="/me/edit">
                <Text
                  typography="body2"
                  foreground="primary"
                  className="inline-flex items-center gap-0.5"
                >
                  설정 <ChevronRight size={14} aria-hidden />
                </Text>
              </Link>
            </HStack>
          </>
        ) : (
          <>
            <VStack gap={3}>
              <Text typography="subtitle1" foreground="muted">
                내 게임
              </Text>
              <VStack gap={2}>
                {myGames.map(({ game, role }) => (
                  <GameListItem key={game.id} game={game} role={role} />
                ))}
              </VStack>
            </VStack>

            <HStack gap={2}>
              <Button asChild size="lg" className="h-[50px] w-full flex-1">
                <Link href="/games">구인 목록 보기</Link>
              </Button>
              <SignOutButton className="h-[50px] w-[104px]" />
            </HStack>
          </>
        )}
      </VStack>
    </Container>
  );
}
