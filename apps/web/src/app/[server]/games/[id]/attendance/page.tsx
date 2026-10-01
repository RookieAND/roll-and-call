import type { Metadata } from "next";

import { GameAttendanceView } from "@/views/game-attendance";

export const metadata: Metadata = { title: "출석 확인" };
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <GameAttendanceView id={id} />;
}
