import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getAuditEntry } from "@/shared/server";
import { AuditEntryView } from "@/views/audit-entry";

export async function generateMetadata({
  params,
}: PageProps<"/[server]/log/[id]">): Promise<Metadata> {
  const entry = await getAuditEntry((await params).id);
  return { title: entry ? `${entry.action} · ${entry.targetName}` : "조치 상세" };
}

export default async function AuditEntryPage({ params }: PageProps<"/[server]/log/[id]">) {
  const entry = await getAuditEntry((await params).id);
  if (!entry) notFound();
  return <AuditEntryView entry={entry} />;
}
