import type { Metadata } from "next";

import { requireMembership } from "@/shared/server";
import { ManageGameView } from "@/views/manage-game";

export const metadata: Metadata = { title: "운영 관리" };
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  await requireMembership();
  const { id } = await params;
  return <ManageGameView id={id} />;
}
