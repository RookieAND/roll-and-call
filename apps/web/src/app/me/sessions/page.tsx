import type { Metadata } from "next";
import { Suspense } from "react";

import { MySessionsView } from "@/views/my-sessions";

import Loading from "./loading";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "내 세션" };

// loading.tsx는 검색어만 바뀌는 이동(탭·칩)에서는 다시 뜨지 않아 key로 경계를 새로 건다.
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; status?: string }>;
}) {
  const { tab, status } = await searchParams;
  return (
    <Suspense key={`${tab}-${status}`} fallback={<Loading />}>
      <MySessionsView tab={tab} status={status} />
    </Suspense>
  );
}
