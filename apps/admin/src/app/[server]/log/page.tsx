import { compact } from "es-toolkit";
import type { Metadata } from "next";

import { parseSort, stringParams } from "@/shared/lib";
import { listAuditLog } from "@/shared/server";
import { AUDIT_LOG_SORT, AuditLogView } from "@/views/audit-log";

export const metadata: Metadata = { title: "활동 기록" };

export default async function AuditLogPage({ searchParams }: PageProps<"/[server]/log">) {
  const query = stringParams(await searchParams);
  const sort = parseSort({ searchParams: query, ...AUDIT_LOG_SORT });
  const log = await listAuditLog({
    actor: query.actor,
    actions: compact(query.actions?.split(",") ?? []),
    period: query.period,
    q: query.q,
    target: query.target,
    targetUser: query.targetUser,
    targetGame: query.targetGame,
    dir: sort.dir,
  });
  return <AuditLogView log={log} query={query} sort={sort} />;
}
