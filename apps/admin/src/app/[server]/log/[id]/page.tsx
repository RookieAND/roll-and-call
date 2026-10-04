import { Button } from "@roll-and-call/ui";
import type { Metadata } from "next";

import { getAuditEntry } from "@/shared/server";
import { AdminHeader, EMPTY_IMAGE, EmptyState, ServerLink } from "@/shared/ui";
import { AuditEntryView } from "@/views/audit-entry";

export async function generateMetadata({
  params,
}: PageProps<"/[server]/log/[id]">): Promise<Metadata> {
  const entry = await getAuditEntry((await params).id);
  return { title: entry ? `${entry.action} · ${entry.targetName}` : "조치 상세" };
}

export default async function AuditEntryPage({ params }: PageProps<"/[server]/log/[id]">) {
  const entry = await getAuditEntry((await params).id);
  if (!entry) {
    return (
      <>
        <AdminHeader title="활동 기록" sub="조치 상세" />
        <EmptyState
          size="full"
          image={EMPTY_IMAGE.search}
          title="보관 기간이 지나 삭제된 기록입니다"
          action={
            <Button variant="outline" render={<ServerLink path="/log" />}>
              활동 기록으로
            </Button>
          }
          className="flex-1"
        />
      </>
    );
  }
  return <AuditEntryView entry={entry} />;
}
