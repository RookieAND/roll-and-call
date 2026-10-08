import type { Metadata } from "next";

import { QuestListView } from "@/views/quest-list";

export const metadata: Metadata = { title: "튜토리얼 퀘스트" };

export default async function QuestListPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; cleared?: string; achievement?: string }>;
}) {
  const { from, cleared, achievement } = await searchParams;
  return (
    <QuestListView
      review={from === "me"}
      justCleared={cleared ?? null}
      achievement={achievement === "1"}
    />
  );
}
