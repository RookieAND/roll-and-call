import type { Metadata } from "next";

import { CreateGameView } from "@/views/create-game";

export const metadata: Metadata = { title: "새 구인글" };
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ rulebook?: string; from?: string }>;
}) {
  const { rulebook, from } = await searchParams;
  return <CreateGameView rulebookId={rulebook} previousGameId={from} />;
}
