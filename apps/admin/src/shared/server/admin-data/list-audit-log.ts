import "server-only";
import { AUDIT_PERIODS } from "./audit-period";
import { db } from "./mock-db";

const DAY = 86_400_000;

interface AuditLogFilter {
  actor?: string;
  actions?: string[];
  period?: string;
  target?: string;
}

// 최신순 활동 기록. 대상은 부분 일치로 좁힌다(다른 화면의 [활동 기록에서 보기]가 ?target=으로 넘긴다).
export async function listAuditLog({ actor, actions = [], period, target }: AuditLogFilter) {
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
  const actors = [...new Set(db.auditLog.map((entry) => entry.actor))];
  return { rows, actors };
}
