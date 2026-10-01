import type { Metadata } from "next";

import { RulebookSubmittedView } from "@/views/rulebook-submitted";

export const metadata: Metadata = { title: "인증 신청" };
export default async function Page({ params }: { params: Promise<{ rulebookId: string }> }) {
  const { rulebookId } = await params;
  return <RulebookSubmittedView rulebookId={rulebookId} />;
}
