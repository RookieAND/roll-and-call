import { hasOnboarded } from "@roll-and-call/database/profiles";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { serverPath } from "@/shared/lib";
import { getCurrentServer, getCurrentSessionUser, requireMembership } from "@/shared/server";
import { HomeSkeleton, HomeView } from "@/views/home";

export async function generateMetadata(): Promise<Metadata> {
  const server = await getCurrentServer();
  return { title: server.name };
}

// 쿼리만 바뀌는 이동은 loading.tsx가 다시 뜨지 않으므로, 달을 key로 경계를 새로 만든다. 같은 달 안의 날짜 선택은 pushState라 서버를 거치지 않는다.
export default async function Page({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
  await requireMembership();
  const { date } = await searchParams;
  const [user, server] = await Promise.all([getCurrentSessionUser(), getCurrentServer()]);
  // 온보딩을 마치지 않은 계정은 서버 홈에 처음 닿을 때 튜토리얼 퀘스트 목록으로 한 번 보낸다. 목록에 들어온 순간 마친 것으로 친다.
  if (user && !(await hasOnboarded(user.id))) {
    redirect(serverPath({ slug: server.slug, path: "/onboarding" }));
  }

  return (
    <Suspense key={date?.slice(0, 7)} fallback={<HomeSkeleton date={date} />}>
      <HomeView date={date} />
    </Suspense>
  );
}
