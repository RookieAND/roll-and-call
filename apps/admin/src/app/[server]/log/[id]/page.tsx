import { Button } from "@roll-and-call/ui";
import type { Metadata } from "next";

import { getAuditEntry } from "@/entities/audit/server";
import { withQuery, stringParams } from "@/shared/lib";
import { AdminHeader, EMPTY_IMAGE, EmptyState, ServerLink } from "@/shared/ui";
import {
  AuditEntryGoneMobileView,
  AuditEntryMobileView,
  AuditEntryView,
} from "@/views/audit-entry";

export async function generateMetadata({
  params,
}: PageProps<"/[server]/log/[id]">): Promise<Metadata> {
  const entry = await getAuditEntry((await params).id);
  return { title: entry ? `${entry.action} · ${entry.targetName}` : "조치 상세" };
}

export default async function AuditEntryPage({
  params,
  searchParams,
}: PageProps<"/[server]/log/[id]">) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const entry = await getAuditEntry(id);
  if (!entry) {
    return (
      <>
        <div className="contents lg:hidden">
          <AuditEntryGoneMobileView />
        </div>
        <div className="contents max-lg:hidden">
          <AdminHeader title="활동 기록" />
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
        </div>
      </>
    );
  }
  const listHref = withQuery("/log", stringParams(query), {});
  return (
    <>
      <div className="contents max-lg:hidden">
        <AuditEntryView entry={entry} listHref={listHref} />
      </div>
      <div className="contents lg:hidden">
        <AuditEntryMobileView entry={entry} listHref={listHref} />
      </div>
    </>
  );
}
