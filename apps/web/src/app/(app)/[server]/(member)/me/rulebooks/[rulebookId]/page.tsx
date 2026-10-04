import type { Metadata } from "next";

import { requireMembership } from "@/shared/server";
import { RulebookCertView } from "@/views/rulebook-cert";

export const metadata: Metadata = { title: "신청 상세" };
export default async function Page({ params }: { params: Promise<{ rulebookId: string }> }) {
  await requireMembership();
  const { rulebookId } = await params;
  return <RulebookCertView rulebookId={rulebookId} />;
}
