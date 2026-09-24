import type { AuditAction } from "./audit-actions";

// 다른 운영진이 먼저 처리했으면 아무것도 바꾸지 않고 그 처리를 돌려준다.
export type RulebookActionResult =
  | { ok: true }
  | { ok: false; conflict: { action: AuditAction; by: string; at: Date } | null };
