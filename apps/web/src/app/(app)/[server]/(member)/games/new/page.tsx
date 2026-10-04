import type { Metadata } from "next";

import { requireMembership } from "@/shared/server";
import { CreateGameView } from "@/views/create-game";

export const metadata: Metadata = { title: "새 구인글" };
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ rulebook?: string }>;
}) {
  await requireMembership();
  const { rulebook } = await searchParams;
  return <CreateGameView rulebookId={rulebook} />;
}
