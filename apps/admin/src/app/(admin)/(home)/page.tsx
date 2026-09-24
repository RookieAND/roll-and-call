import type { Metadata } from "next";

import { getPendingItems, getWeeklySummary } from "@/shared/server";
import { HomeView } from "@/views/home";

export const metadata: Metadata = { title: "홈" };

export default async function HomePage({ searchParams }: PageProps<"/">) {
  const { empty } = (await searchParams) as Record<string, string | undefined>;
  const [weekly, pendingItems] = await Promise.all([getWeeklySummary(), getPendingItems()]);
  // ?empty=1은 개발 중에 home_empty 상태를 미리 보는 용도다.
  const previewEmpty = process.env.NODE_ENV !== "production" && empty === "1";
  return <HomeView weekly={weekly} pendingItems={previewEmpty ? [] : pendingItems} />;
}
