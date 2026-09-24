import type { Metadata } from "next";

import { RulebookCertView } from "@/views/rulebook-cert";

export const metadata: Metadata = { title: "룰북 인증" };
export default async function Page({ params }: { params: Promise<{ rulebookId: string }> }) {
  const { rulebookId } = await params;
  return <RulebookCertView rulebookId={rulebookId} />;
}
