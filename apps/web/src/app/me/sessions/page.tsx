import type { Metadata } from "next";

import { MySessionsView } from "@/views/my-sessions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "내 세션" };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; status?: string }>;
}) {
  const { tab, status } = await searchParams;
  return <MySessionsView tab={tab} status={status} />;
}
