import { RENAMED_AUDIT_ACTIONS, type AuditAction } from "./audit-actions";

export function auditActionLabel(action: string) {
  return (RENAMED_AUDIT_ACTIONS[action] ?? action) as AuditAction;
}
