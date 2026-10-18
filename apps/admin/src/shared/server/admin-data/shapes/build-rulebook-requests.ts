import type { AuditAction } from "@roll-and-call/database/audit";
import { rulebookLabel } from "@roll-and-call/database/rulebooks";
import { compact, groupBy, keyBy } from "es-toolkit";

import { similarRulebook } from "../similar-rulebook";
import type { RulebookRequest } from "../types";
import type { ShapeContext } from "./shape-context";

const OUTCOME_ACTION = {
  added: "룰북 추가",
  linked: "룰북 연결",
  rejected: "추가 요청 반려",
} as const satisfies Record<string, AuditAction>;

export function buildRulebookRequests({
  tables,
  nicknameOf,
  shape,
}: ShapeContext): RulebookRequest[] {
  const rulebooks = shape("rulebooks");
  const categoryOf = keyBy(tables.categoryRows, (category) => category.id);
  const gamesOf = groupBy(tables.requestGameRows, (link) => link.requestId);
  return tables.requestRows.map((row) => ({
    id: row.id,
    userId: row.userId,
    name: rulebookLabel(row),
    bookName: row.name,
    edition: row.edition,
    kind: row.kind,
    category: (row.categoryId ? categoryOf[row.categoryId]?.name : undefined) ?? row.categoryName,
    note: compact([row.publisher && `출판사 ${row.publisher}`, row.note]).join(" · "),
    requestedAt: row.createdAt,
    similarTo: similarRulebook(row.name, rulebooks),
    source: row.source,
    gameIds: (gamesOf[row.id] ?? []).map((link) => link.gameId),
    processed:
      row.outcome && row.processedAt
        ? {
            action: OUTCOME_ACTION[row.outcome],
            by: nicknameOf(row.processedBy),
            at: row.processedAt,
          }
        : undefined,
  }));
}
