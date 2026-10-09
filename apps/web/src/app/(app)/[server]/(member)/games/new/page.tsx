import type { Metadata } from "next";

import { requireMembership } from "@/shared/server";
import { CreateGameView } from "@/views/create-game";

export const metadata: Metadata = { title: "새 구인글" };
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ rulebook?: string; from?: string }>;
}) {
  await requireMembership();
  const { rulebook, from } = await searchParams;
  return <CreateGameView rulebookId={rulebook} fromGameId={from} />;
}
