import { AUDIT_PERIODS } from "./audit-period";
import { defaultAuditPeriod } from "./default-audit-period";
import type { AuditLogFilter } from "./filter-audit-log";

const DAY = 86_400_000;

// 고른 기간(없으면 기본 기간)과 그 시작 시각. 전체 기간이면 since가 null이다.
export function auditLogPeriod({ filter, now }: { filter: AuditLogFilter; now: number }) {
  const scoped = Boolean(filter.q || filter.target || filter.targetUser || filter.targetGame);
  const period = filter.period ?? defaultAuditPeriod({ scoped });
  const days = AUDIT_PERIODS.find((candidate) => candidate.value === period)?.days;
  return { period, since: days ? now - days * DAY : null };
}
