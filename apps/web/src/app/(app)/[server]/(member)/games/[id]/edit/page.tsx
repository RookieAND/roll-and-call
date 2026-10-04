import type { Metadata } from "next";

import { requireMembership } from "@/shared/server";
import { EditGameView } from "@/views/edit-game";

export const metadata: Metadata = { title: "구인 수정" };
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  await requireMembership();
  const { id } = await params;
  return <EditGameView id={id} />;
}
