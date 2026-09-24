import { AUDIT_RETENTION_DAYS, EXPIRING_AUDIT_ACTIONS } from "./audit-actions";

const DAY = 86_400_000;

// 지워질 때까지 남은 날. 계속 보관하는 조치는 null.
export function retentionDaysLeft(entry: { action: string; at: Date }, now = new Date()) {
  if (!EXPIRING_AUDIT_ACTIONS.includes(entry.action)) return null;
  const expiresAt = entry.at.getTime() + AUDIT_RETENTION_DAYS * DAY;
  return Math.max(0, Math.ceil((expiresAt - now.getTime()) / DAY));
}
