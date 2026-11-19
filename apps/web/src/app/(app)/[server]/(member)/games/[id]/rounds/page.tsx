import type { Metadata } from "next";

import { requireMembership } from "@/shared/server";
import { GameRoundsView } from "@/views/game-rounds";

export const metadata: Metadata = { title: "회차 일정" };

export default async function Page({ params }: PageProps<"/[server]/games/[id]/rounds">) {
  await requireMembership();
  const { id } = await params;
  return <GameRoundsView id={id} />;
}
