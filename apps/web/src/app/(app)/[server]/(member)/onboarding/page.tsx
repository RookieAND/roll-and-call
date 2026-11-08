import type { Metadata } from "next";

import { QuestListView } from "@/views/quest-list";

export const metadata: Metadata = { title: "튜토리얼 퀘스트" };

export default async function QuestListPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; achievement?: string }>;
}) {
  const { from, achievement } = await searchParams;
  return <QuestListView review={from === "me"} achievement={achievement === "1"} />;
}
