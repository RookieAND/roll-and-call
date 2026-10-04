import { Container, VStack } from "@roll-and-call/ui";
import { Suspense } from "react";

import { LoginRequired } from "@/features/auth";
import { getCurrentServer, getCurrentSessionUser, requireMembership } from "@/shared/server";
import { AppBar } from "@/shared/ui";

import { loadInbox } from "../api/load-inbox";
import { nullOnError } from "../api/null-on-error";
import { CountSkeleton } from "./count-skeleton";
import { NotificationsScreen } from "./notifications-screen";
import { TodoCount } from "./todo-count";
import { TodoPanel } from "./todo-panel";
import { TodoSkeleton } from "./todo-skeleton";

// 로그인을 먼저 본다. requireMembership은 비로그인도 가입 화면으로 보내서, 순서가 바뀌면 로그인 안내가 보이지 않는다.
export async function NotificationsView() {
  const user = await getCurrentSessionUser();
  if (!user) {
    return (
      <>
        <AppBar title="알림" />
        <Container size="sm">
          <VStack className="py-200">
            <LoginRequired
              image="/empty-states/empty-party.png"
              title="로그인하면 알림을 볼 수 있습니다"
              description="디스코드 계정으로 로그인해 주세요."
            />
          </VStack>
        </Container>
      </>
    );
  }
  await requireMembership();
  const server = await getCurrentServer();
  const owner = { serverId: server.id, userId: user.id };
  return (
    <NotificationsScreen
      todoCount={
        <Suspense fallback={<CountSkeleton />}>
          <TodoCount {...owner} />
        </Suspense>
      }
      todoPanel={
        <Suspense fallback={<TodoSkeleton />}>
          <TodoPanel {...owner} />
        </Suspense>
      }
      inbox={nullOnError(loadInbox(owner))}
    />
  );
}
