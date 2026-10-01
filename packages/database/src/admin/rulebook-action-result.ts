import type { AuditAction } from "./audit-actions";

export type RulebookActionResult =
  | { ok: true }
  | { ok: false; conflict: { action: AuditAction; by: string; at: Date } | null };
