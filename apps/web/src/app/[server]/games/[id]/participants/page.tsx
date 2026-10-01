import type { Metadata } from "next";

import { ManageParticipantsView } from "@/views/manage-participants";

export const metadata: Metadata = { title: "참여자 관리" };
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ManageParticipantsView id={id} />;
}
