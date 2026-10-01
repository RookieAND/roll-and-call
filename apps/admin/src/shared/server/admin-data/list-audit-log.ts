import "server-only";
import { uniq } from "es-toolkit";

import { AUDIT_PERIODS } from "./audit-period";
import { loadSnapshot } from "./snapshot";

const DAY = 86_400_000;

interface AuditLogFilter {
  actor?: string;
  actions?: string[];
  period?: string;
  target?: string;
}

export async function listAuditLog({ actor, actions = [], period, target }: AuditLogFilter) {
  const db = await loadSnapshot();
  const days = AUDIT_PERIODS.find((candidate) => candidate.value === period)?.days;
  const since = days ? Date.now() - days * DAY : null;
  const rows = db.auditLog
    .filter(
      (entry) =>
        (!actor || entry.actor === actor) &&
        (actions.length === 0 || actions.includes(entry.action)) &&
        (!since || entry.at.getTime() >= since) &&
        (!target || entry.target.includes(target)),
    )
    .toSorted((a, b) => b.at.getTime() - a.at.getTime());
  const actors = uniq(db.auditLog.map((entry) => entry.actor));
  return { rows, actors };
}
