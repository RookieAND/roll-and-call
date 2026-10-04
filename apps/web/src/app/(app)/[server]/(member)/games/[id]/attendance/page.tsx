import type { Metadata } from "next";

import { requireMembership } from "@/shared/server";
import { GameAttendanceView } from "@/views/game-attendance";

export const metadata: Metadata = { title: "출석 확인" };
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  await requireMembership();
  const { id } = await params;
  return <GameAttendanceView id={id} />;
}
