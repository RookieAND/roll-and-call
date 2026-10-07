import type { Metadata } from "next";

import { requireMembership } from "@/shared/server";
import { GameScheduleView } from "@/views/game-schedule";

export const metadata: Metadata = { title: "일정 조율" };
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  await requireMembership();
  const { id } = await params;
  return <GameScheduleView id={id} />;
}
