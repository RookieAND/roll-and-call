import type { User } from "@supabase/supabase-js";
import { Button, Container, HStack, Text, VStack } from "@trpg/ui";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { AppBar, EmptyState } from "@/shared/ui";
import { loadMySessions, SessionCard, SessionList } from "@/widgets/session-list";
import { homeAgenda } from "../model/home-agenda";
import { HomeStartEmpty } from "./home-start-empty";

// 로그인 홈 = 지금 해야 할 일. 숫자 세기(참여·운영 건수)는 마이페이지 한 곳에서만 한다.
export async function HomeDashboard({ user }: { user: User }) {
  const sessions = await loadMySessions(user.id);
  const { todos, upcoming } = homeAgenda(sessions);
  const hasAny = sessions.joined.length + sessions.hosted.length + sessions.past.length > 0;

  return (
    <>
      <AppBar
        title="홈"
        action={
          <Button asChild size="sm">
            <Link href="/games/new">새 구인</Link>
          </Button>
        }
      />
      <Container size="sm">
        <VStack gap={6} className="py-5">
          {!hasAny && <HomeStartEmpty />}

          {todos.length > 0 && (
            <section className="flex flex-col gap-2.5">
              <div>
                <Text typography="heading3" render={<h2 />}>
                  할 일 {todos.length}건
                </Text>
                <Text typography="body4" foreground="hint" render={<p />} className="mt-0.5">
                  먼저 처리하면 좋은 것부터 보여줍니다.
                </Text>
              </div>
              <div className="flex flex-col gap-2.5">
                {todos.map(({ card, eyebrow }) => (
                  <SessionCard key={card.id} model={card} eyebrow={eyebrow} />
                ))}
              </div>
            </section>
          )}

          {upcoming.length > 0 && (
            <section className="flex flex-col gap-2.5">
              <HStack justify="between" align="center">
                <Text typography="heading3" render={<h2 />}>
                  다가오는 세션
                </Text>
                <Link href="/me/sessions">
                  <Text
                    typography="body4"
                    foreground="primary"
                    className="inline-flex items-center gap-0.5 text-[12.5px] font-semibold"
                  >
                    내 세션 <ChevronRight size={14} aria-hidden />
                  </Text>
                </Link>
              </HStack>
              <SessionList items={upcoming} />
            </section>
          )}

          {hasAny && todos.length === 0 && upcoming.length === 0 && (
            <EmptyState
              size="section"
              image="/empty-states/empty-my-games.png"
              title="지금 할 일이 없습니다"
              description="새 구인을 둘러보거나 직접 열어보세요."
              action={
                <Button asChild className="h-11 w-full">
                  <Link href="/games">구인 목록 보기</Link>
                </Button>
              }
            />
          )}
        </VStack>
      </Container>
    </>
  );
}
