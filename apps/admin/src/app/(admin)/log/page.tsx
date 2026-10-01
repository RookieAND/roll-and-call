import { compact } from "es-toolkit";
import type { Metadata } from "next";

import { DEFAULT_AUDIT_PERIOD, listAuditLog } from "@/shared/server";
import { AuditLogView } from "@/views/audit-log";

export const metadata: Metadata = { title: "활동 기록" };

export default async function AuditLogPage({ searchParams }: PageProps<"/log">) {
  const query = (await searchParams) as Record<string, string | undefined>;
  const log = await listAuditLog({
    actor: query.actor,
    actions: compact(query.actions?.split(",") ?? []),
    period: query.period ?? (query.target ? undefined : DEFAULT_AUDIT_PERIOD),
    target: query.target ?? query.q,
  });
  return <AuditLogView log={log} query={query} />;
}
