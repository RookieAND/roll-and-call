import { hasOnboarded } from "@roll-and-call/database/profiles";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { serverPath } from "@/shared/lib";
import { getCurrentServer, getCurrentSessionUser } from "@/shared/server";
import { HomeSkeleton, HomeView } from "@/views/home";

export async function generateMetadata(): Promise<Metadata> {
  const server = await getCurrentServer();
  return { title: server.name };
}

// 쿼리만 바뀌는 이동은 loading.tsx가 다시 뜨지 않으므로, 달을 key로 경계를 새로 만든다. 같은 달 안의 날짜 선택은 pushState라 서버를 거치지 않는다.
export default async function Page({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
  const { date } = await searchParams;
  const [user, server] = await Promise.all([getCurrentSessionUser(), getCurrentServer()]);
  // 서비스 소개는 계정당 한 번, 서버 홈에 처음 닿을 때 그리기 전에 보낸다(R6·R17·D48).
  if (user && !(await hasOnboarded(user.id))) {
    const next = serverPath({ slug: server.slug, path: "/games" });
    redirect(`/onboarding?next=${encodeURIComponent(next)}`);
  }

  return (
    <Suspense key={date?.slice(0, 7)} fallback={<HomeSkeleton date={date} />}>
      <HomeView date={date} />
    </Suspense>
  );
}
