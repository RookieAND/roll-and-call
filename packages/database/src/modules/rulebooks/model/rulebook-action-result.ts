import type { AuditAction } from "#/modules/moderation/model/audit-actions";

export type RulebookActionResult =
  | { ok: true }
  | {
      ok: false;
      conflict: { action: AuditAction; by: string; byId: string | null; at: Date } | null;
    };
