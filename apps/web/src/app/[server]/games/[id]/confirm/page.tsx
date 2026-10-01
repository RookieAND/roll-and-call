import type { Metadata } from "next";

import { GameConfirmView } from "@/views/game-confirm";

export const metadata: Metadata = { title: "세션 시간 결정" };
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <GameConfirmView id={id} />;
}
