import type { Metadata } from "next";

import { requireMembership } from "@/shared/server";
import { EditMemoView } from "@/views/edit-memo";

export const metadata: Metadata = { title: "메모" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  await requireMembership();
  const { id } = await params;
  return <EditMemoView id={id} />;
}
