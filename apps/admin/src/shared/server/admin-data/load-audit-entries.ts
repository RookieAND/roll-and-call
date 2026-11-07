import "server-only";
import { listAdminAuditRows, listAdminRulebookLabels } from "@roll-and-call/database/moderation";
import { rulebookLabel } from "@roll-and-call/database/rulebooks/model";

import { getCurrentServer } from "../auth/get-current-server";
import { requireStaff } from "../auth/require-staff";
import { auditEntryOf } from "./audit-entry-of";
import type { AuditEntry } from "./types";

type AuditEntryFilter = Omit<Parameters<typeof listAdminAuditRows>[0], "serverId">;

// 활동 기록을 조건에 맞는 것만 읽어 최신순으로 돌려준다(스냅숏에 활동 기록 전체를 싣지 않는다).
export async function loadAuditEntries(filter: AuditEntryFilter): Promise<AuditEntry[]> {
  await requireStaff();
  const server = await getCurrentServer();
  const rows = await listAdminAuditRows({ serverId: server.id, ...filter });
  if (rows.length === 0) return [];
  const rulebooks = await listAdminRulebookLabels({ serverId: server.id });
  const rulebookIdOf = new Map(rulebooks.map((rulebook) => [rulebookLabel(rulebook), rulebook.id]));
  return rows.map((row) => auditEntryOf({ row, rulebookIdOf }));
}
