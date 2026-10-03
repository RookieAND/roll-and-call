import type { Metadata } from "next";

import { EditMemoView } from "@/views/edit-memo";

export const metadata: Metadata = { title: "메모" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EditMemoView id={id} />;
}
