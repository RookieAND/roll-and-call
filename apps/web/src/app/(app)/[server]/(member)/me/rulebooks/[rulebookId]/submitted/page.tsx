import type { Metadata } from "next";

import { requireMembership } from "@/shared/server";
import { RulebookSubmittedView } from "@/views/rulebook-submitted";

export const metadata: Metadata = { title: "인증 신청" };
export default async function Page({ params }: { params: Promise<{ rulebookId: string }> }) {
  await requireMembership();
  const { rulebookId } = await params;
  return <RulebookSubmittedView rulebookId={rulebookId} />;
}
