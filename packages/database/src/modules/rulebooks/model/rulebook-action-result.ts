import type { AuditAction } from "#db/modules/audit";

export type RulebookActionResult =
  | { ok: true }
  | {
      ok: false;
      conflict: { action: AuditAction; by: string; byId: string | null; at: Date } | null;
    };
