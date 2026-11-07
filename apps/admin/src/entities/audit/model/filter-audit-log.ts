import { SORT_DIR, sortRows, type SortDir } from "@/shared/lib";
import type { AuditEntry } from "@/shared/server";

import { auditLogPeriod } from "./audit-log-period";

export interface AuditLogFilter {
  actor?: string;
  actions?: string[];
  period?: string;
  q?: string;
  target?: string;
  targetUser?: string;
  targetGame?: string;
  dir?: SortDir;
}

interface FilterAuditLogOptions {
  entries: AuditEntry[];
  filter: AuditLogFilter;
  now?: number;
}

// 대상은 ID로 거른다. ID가 없는 대상(후기, 룰북, 서버 설정)만 「 · 」 앞 이름이 정확히 같은 기록을 고른다.
export function filterAuditLog({ entries, filter, now = Date.now() }: FilterAuditLogOptions) {
  const { actor, actions = [], q, target, targetUser, targetGame, dir = SORT_DIR.desc } = filter;
  const { period, since } = auditLogPeriod({ filter, now });
  const keyword = q?.toLowerCase();
  const rows = entries.filter(
    (entry) =>
      (!actor || entry.actor === actor) &&
      (actions.length === 0 || actions.includes(entry.action)) &&
      (!since || entry.at.getTime() >= since) &&
      (!targetUser || entry.targetUserId === targetUser) &&
      (!targetGame || entry.targetGameId === targetGame) &&
      (!target || entry.target.split(" · ")[0] === target) &&
      (!keyword || entry.target.toLowerCase().includes(keyword)),
  );
  return {
    period,
    rows: sortRows({ rows, sort: { column: "at", dir }, accessors: { at: (entry) => entry.at } }),
  };
}
