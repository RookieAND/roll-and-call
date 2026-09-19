import type { Metadata } from "next";

import { ManageGameView } from "@/views/manage-game";

export const metadata: Metadata = { title: "구인 관리" };
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ManageGameView id={id} />;
}
