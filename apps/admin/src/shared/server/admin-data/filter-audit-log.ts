import { SORT_DIR, sortRows, type SortDir } from "@/shared/lib";

import { AUDIT_PERIODS } from "./audit-period";
import { defaultAuditPeriod } from "./default-audit-period";
import type { AuditEntry } from "./types";

const DAY = 86_400_000;

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
  const scoped = Boolean(q || target || targetUser || targetGame);
  const period = filter.period ?? defaultAuditPeriod({ scoped });
  const days = AUDIT_PERIODS.find((candidate) => candidate.value === period)?.days;
  const since = days ? now - days * DAY : null;
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
