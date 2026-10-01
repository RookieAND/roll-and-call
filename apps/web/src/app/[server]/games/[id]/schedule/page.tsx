import type { Metadata } from "next";

import { GameScheduleView } from "@/views/game-schedule";

export const metadata: Metadata = { title: "일정 조율" };
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <GameScheduleView id={id} />;
}
