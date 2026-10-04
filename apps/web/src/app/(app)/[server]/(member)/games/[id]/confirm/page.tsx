import type { Metadata } from "next";

import { requireMembership } from "@/shared/server";
import { GameConfirmView } from "@/views/game-confirm";

export const metadata: Metadata = { title: "세션 시간 결정" };
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  await requireMembership();
  const { id } = await params;
  return <GameConfirmView id={id} />;
}
