import type { Metadata } from "next";

import { listAuditLog } from "@/shared/server";
import { AuditLogView } from "@/views/audit-log";

export const metadata: Metadata = { title: "활동 기록" };

export default async function AuditLogPage({ searchParams }: PageProps<"/log">) {
  const query = (await searchParams) as Record<string, string | undefined>;
  const log = await listAuditLog({
    actor: query.actor,
    actions: query.actions?.split(",").filter(Boolean),
    period: query.period,
    target: query.target ?? query.q,
  });
  return <AuditLogView log={log} query={query} />;
}
