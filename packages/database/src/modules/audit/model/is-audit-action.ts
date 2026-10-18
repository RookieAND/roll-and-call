import { AUDIT_ACTIONS, LEGACY_AUDIT_ACTIONS, type AuditAction } from "./audit-actions";

export function isAuditAction(value: string): value is AuditAction {
  return [...AUDIT_ACTIONS, ...LEGACY_AUDIT_ACTIONS].some((action) => action === value);
}
