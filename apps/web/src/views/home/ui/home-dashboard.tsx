import type { User } from "@supabase/supabase-js";
import { Button, Container, VStack } from "@trpg/ui";
import Link from "next/link";

import { AppBar, EmptyState } from "@/shared/ui";
import { loadMySessions } from "@/widgets/session-list";

import { homeAgenda } from "../model/home-agenda";
import { HomeStartEmpty } from "./home-start-empty";
import { HomeTodos } from "./home-todos";
import { HomeUpcoming } from "./home-upcoming";

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
          {todos.length > 0 && <HomeTodos todos={todos} />}
          {upcoming.length > 0 && <HomeUpcoming upcoming={upcoming} />}
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
