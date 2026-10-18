import "server-only";
import { compact, uniq } from "es-toolkit";

import { loadAdminData } from "@/shared/server";

import { filterAuditLog, type AuditLogFilter } from "../model/filter-audit-log";

export async function listAuditLog(filter: AuditLogFilter) {
  const db = await loadAdminData(["users", "sessions", "auditLog"]);
  const { rows, period } = filterAuditLog({ entries: db.auditLog, filter });
  const actors = uniq(db.auditLog.map((entry) => entry.actor));
  const targetNames = compact([
    filter.targetUser && db.users.find((user) => user.id === filter.targetUser)?.nickname,
    filter.targetGame && db.sessions.find((session) => session.id === filter.targetGame)?.title,
    filter.target,
  ]);
  return { rows, actors, period, targetName: targetNames.join(" · ") || undefined };
}
